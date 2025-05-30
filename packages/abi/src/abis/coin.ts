export const COIN_ABI = {
  address: '0x1',
  name: 'coin',
  friends: ['0x1::aptos_coin', '0x1::transaction_fee', '0x1::genesis'],
  exposed_functions: [
    {
      name: 'extract',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&mut 0x1::coin::Coin<T0>', 'u64'],
      return: ['0x1::coin::Coin<T0>'],
    },
    {
      name: 'value',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&0x1::coin::Coin<T0>'],
      return: ['u64'],
    },
    {
      name: 'merge',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&mut 0x1::coin::Coin<T0>', '0x1::coin::Coin<T0>'],
      return: [],
    },
    {
      name: 'initialize',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [
        '&signer',
        '0x1::string::String',
        '0x1::string::String',
        'u8',
        'bool',
      ],
      return: [
        '0x1::coin::BurnCapability<T0>',
        '0x1::coin::FreezeCapability<T0>',
        '0x1::coin::MintCapability<T0>',
      ],
    },
    {
      name: 'burn',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['0x1::coin::Coin<T0>', '&0x1::coin::BurnCapability<T0>'],
      return: [],
    },
    {
      name: 'transfer',
      visibility: 'public',
      is_entry: true,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&signer', 'address', 'u64'],
      return: [],
    },
    {
      name: 'name',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [],
      return: ['0x1::string::String'],
    },
    {
      name: 'symbol',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [],
      return: ['0x1::string::String'],
    },
    {
      name: 'decimals',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [],
      return: ['u8'],
    },
    {
      name: 'balance',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['address'],
      return: ['u64'],
    },
    {
      name: 'burn_from',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['address', 'u64', '&0x1::coin::BurnCapability<T0>'],
      return: [],
    },
    {
      name: 'deposit',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['address', '0x1::coin::Coin<T0>'],
      return: [],
    },
    {
      name: 'destroy_zero',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['0x1::coin::Coin<T0>'],
      return: [],
    },
    {
      name: 'is_balance_at_least',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['address', 'u64'],
      return: ['bool'],
    },
    {
      name: 'mint',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['u64', '&0x1::coin::MintCapability<T0>'],
      return: ['0x1::coin::Coin<T0>'],
    },
    {
      name: 'supply',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [],
      return: ['0x1::option::Option<u128>'],
    },
    {
      name: 'withdraw',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&signer', 'u64'],
      return: ['0x1::coin::Coin<T0>'],
    },
    {
      name: 'zero',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [],
      return: ['0x1::coin::Coin<T0>'],
    },
    {
      name: 'deposit_with_signer',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&signer', '0x1::coin::Coin<T0>'],
      return: [],
    },
    {
      name: 'allow_supply_upgrades',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [],
      params: ['&signer', 'bool'],
      return: [],
    },
    {
      name: 'burn_from_for_gas',
      visibility: 'friend',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['address', 'u64', '&0x1::coin::BurnCapability<T0>'],
      return: [],
    },
    {
      name: 'coin_supply',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [],
      return: ['0x1::option::Option<u128>'],
    },
    {
      name: 'coin_to_fungible_asset',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['0x1::coin::Coin<T0>'],
      return: ['0x1::fungible_asset::FungibleAsset'],
    },
    {
      name: 'convert_and_take_paired_burn_ref',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['0x1::coin::BurnCapability<T0>'],
      return: ['0x1::fungible_asset::BurnRef'],
    },
    {
      name: 'create_coin_conversion_map',
      visibility: 'public',
      is_entry: true,
      is_view: false,
      generic_type_params: [],
      params: ['&signer'],
      return: [],
    },
    {
      name: 'create_pairing',
      visibility: 'public',
      is_entry: true,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&signer'],
      return: [],
    },
    {
      name: 'deposit_for_gas_fee',
      visibility: 'friend',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['address', '0x1::coin::Coin<T0>'],
      return: [],
    },
    {
      name: 'destroy_burn_cap',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['0x1::coin::BurnCapability<T0>'],
      return: [],
    },
    {
      name: 'destroy_freeze_cap',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['0x1::coin::FreezeCapability<T0>'],
      return: [],
    },
    {
      name: 'destroy_mint_cap',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['0x1::coin::MintCapability<T0>'],
      return: [],
    },
    {
      name: 'ensure_paired_metadata',
      visibility: 'friend',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [],
      return: ['0x1::object::Object<0x1::fungible_asset::Metadata>'],
    },
    {
      name: 'extract_all',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&mut 0x1::coin::Coin<T0>'],
      return: ['0x1::coin::Coin<T0>'],
    },
    {
      name: 'freeze_coin_store',
      visibility: 'public',
      is_entry: true,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['address', '&0x1::coin::FreezeCapability<T0>'],
      return: [],
    },
    {
      name: 'get_paired_burn_ref',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&0x1::coin::BurnCapability<T0>'],
      return: ['0x1::fungible_asset::BurnRef', '0x1::coin::BurnRefReceipt'],
    },
    {
      name: 'get_paired_mint_ref',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&0x1::coin::MintCapability<T0>'],
      return: ['0x1::fungible_asset::MintRef', '0x1::coin::MintRefReceipt'],
    },
    {
      name: 'get_paired_transfer_ref',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&0x1::coin::FreezeCapability<T0>'],
      return: [
        '0x1::fungible_asset::TransferRef',
        '0x1::coin::TransferRefReceipt',
      ],
    },
    {
      name: 'initialize_with_parallelizable_supply',
      visibility: 'friend',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [
        '&signer',
        '0x1::string::String',
        '0x1::string::String',
        'u8',
        'bool',
      ],
      return: [
        '0x1::coin::BurnCapability<T0>',
        '0x1::coin::FreezeCapability<T0>',
        '0x1::coin::MintCapability<T0>',
      ],
    },
    {
      name: 'is_account_registered',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['address'],
      return: ['bool'],
    },
    {
      name: 'is_coin_initialized',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [],
      return: ['bool'],
    },
    {
      name: 'is_coin_store_frozen',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['address'],
      return: ['bool'],
    },
    {
      name: 'migrate_coin_store_to_fungible_store',
      visibility: 'public',
      is_entry: true,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['vector<address>'],
      return: [],
    },
    {
      name: 'migrate_to_fungible_store',
      visibility: 'public',
      is_entry: true,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&signer'],
      return: [],
    },
    {
      name: 'paired_burn_ref_exists',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [],
      return: ['bool'],
    },
    {
      name: 'paired_coin',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [],
      params: ['0x1::object::Object<0x1::fungible_asset::Metadata>'],
      return: ['0x1::option::Option<0x1::type_info::TypeInfo>'],
    },
    {
      name: 'paired_metadata',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [],
      return: [
        '0x1::option::Option<0x1::object::Object<0x1::fungible_asset::Metadata>>',
      ],
    },
    {
      name: 'paired_mint_ref_exists',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [],
      return: ['bool'],
    },
    {
      name: 'paired_transfer_ref_exists',
      visibility: 'public',
      is_entry: false,
      is_view: true,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: [],
      return: ['bool'],
    },
    {
      name: 'register',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&signer'],
      return: [],
    },
    {
      name: 'return_paired_burn_ref',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [],
      params: ['0x1::fungible_asset::BurnRef', '0x1::coin::BurnRefReceipt'],
      return: [],
    },
    {
      name: 'return_paired_mint_ref',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [],
      params: ['0x1::fungible_asset::MintRef', '0x1::coin::MintRefReceipt'],
      return: [],
    },
    {
      name: 'return_paired_transfer_ref',
      visibility: 'public',
      is_entry: false,
      is_view: false,
      generic_type_params: [],
      params: [
        '0x1::fungible_asset::TransferRef',
        '0x1::coin::TransferRefReceipt',
      ],
      return: [],
    },
    {
      name: 'unfreeze_coin_store',
      visibility: 'public',
      is_entry: true,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['address', '&0x1::coin::FreezeCapability<T0>'],
      return: [],
    },
    {
      name: 'upgrade_supply',
      visibility: 'public',
      is_entry: true,
      is_view: false,
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      params: ['&signer'],
      return: [],
    },
  ],
  structs: [
    {
      name: 'Deposit',
      is_native: false,
      is_event: true,
      abilities: ['drop', 'store'],
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      fields: [
        {
          name: 'account',
          type: 'address',
        },
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'DepositEvent',
      is_native: false,
      is_event: false,
      abilities: ['drop', 'store'],
      generic_type_params: [],
      fields: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'Withdraw',
      is_native: false,
      is_event: true,
      abilities: ['drop', 'store'],
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      fields: [
        {
          name: 'account',
          type: 'address',
        },
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'WithdrawEvent',
      is_native: false,
      is_event: false,
      abilities: ['drop', 'store'],
      generic_type_params: [],
      fields: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'AggregatableCoin',
      is_native: false,
      is_event: false,
      abilities: ['store'],
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      fields: [
        {
          name: 'value',
          type: '0x1::aggregator::Aggregator',
        },
      ],
    },
    {
      name: 'BurnCapability',
      is_native: false,
      is_event: false,
      abilities: ['copy', 'store'],
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      fields: [
        {
          name: 'dummy_field',
          type: 'bool',
        },
      ],
    },
    {
      name: 'BurnRefReceipt',
      is_native: false,
      is_event: false,
      abilities: [],
      generic_type_params: [],
      fields: [
        {
          name: 'metadata',
          type: '0x1::object::Object<0x1::fungible_asset::Metadata>',
        },
      ],
    },
    {
      name: 'Coin',
      is_native: false,
      is_event: false,
      abilities: ['store'],
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      fields: [
        {
          name: 'value',
          type: 'u64',
        },
      ],
    },
    {
      name: 'CoinConversionMap',
      is_native: false,
      is_event: false,
      abilities: ['key'],
      generic_type_params: [],
      fields: [
        {
          name: 'coin_to_fungible_asset_map',
          type: '0x1::table::Table<0x1::type_info::TypeInfo, 0x1::object::Object<0x1::fungible_asset::Metadata>>',
        },
      ],
    },
    {
      name: 'CoinDeposit',
      is_native: false,
      is_event: true,
      abilities: ['drop', 'store'],
      generic_type_params: [],
      fields: [
        {
          name: 'coin_type',
          type: '0x1::string::String',
        },
        {
          name: 'account',
          type: 'address',
        },
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'CoinEventHandleDeletion',
      is_native: false,
      is_event: true,
      abilities: ['drop', 'store'],
      generic_type_params: [],
      fields: [
        {
          name: 'event_handle_creation_address',
          type: 'address',
        },
        {
          name: 'deleted_deposit_event_handle_creation_number',
          type: 'u64',
        },
        {
          name: 'deleted_withdraw_event_handle_creation_number',
          type: 'u64',
        },
      ],
    },
    {
      name: 'CoinInfo',
      is_native: false,
      is_event: false,
      abilities: ['key'],
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      fields: [
        {
          name: 'name',
          type: '0x1::string::String',
        },
        {
          name: 'symbol',
          type: '0x1::string::String',
        },
        {
          name: 'decimals',
          type: 'u8',
        },
        {
          name: 'supply',
          type: '0x1::option::Option<0x1::optional_aggregator::OptionalAggregator>',
        },
      ],
    },
    {
      name: 'CoinStore',
      is_native: false,
      is_event: false,
      abilities: ['key'],
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      fields: [
        {
          name: 'coin',
          type: '0x1::coin::Coin<T0>',
        },
        {
          name: 'frozen',
          type: 'bool',
        },
        {
          name: 'deposit_events',
          type: '0x1::event::EventHandle<0x1::coin::DepositEvent>',
        },
        {
          name: 'withdraw_events',
          type: '0x1::event::EventHandle<0x1::coin::WithdrawEvent>',
        },
      ],
    },
    {
      name: 'CoinStoreDeletion',
      is_native: false,
      is_event: true,
      abilities: ['drop', 'store'],
      generic_type_params: [],
      fields: [
        {
          name: 'coin_type',
          type: '0x1::string::String',
        },
        {
          name: 'event_handle_creation_address',
          type: 'address',
        },
        {
          name: 'deleted_deposit_event_handle_creation_number',
          type: 'u64',
        },
        {
          name: 'deleted_withdraw_event_handle_creation_number',
          type: 'u64',
        },
      ],
    },
    {
      name: 'CoinWithdraw',
      is_native: false,
      is_event: true,
      abilities: ['drop', 'store'],
      generic_type_params: [],
      fields: [
        {
          name: 'coin_type',
          type: '0x1::string::String',
        },
        {
          name: 'account',
          type: 'address',
        },
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'FreezeCapability',
      is_native: false,
      is_event: false,
      abilities: ['copy', 'store'],
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      fields: [
        {
          name: 'dummy_field',
          type: 'bool',
        },
      ],
    },
    {
      name: 'MigrationFlag',
      is_native: false,
      is_event: false,
      abilities: ['key'],
      generic_type_params: [],
      fields: [
        {
          name: 'dummy_field',
          type: 'bool',
        },
      ],
    },
    {
      name: 'MintCapability',
      is_native: false,
      is_event: false,
      abilities: ['copy', 'store'],
      generic_type_params: [
        {
          constraints: [],
        },
      ],
      fields: [
        {
          name: 'dummy_field',
          type: 'bool',
        },
      ],
    },
    {
      name: 'MintRefReceipt',
      is_native: false,
      is_event: false,
      abilities: [],
      generic_type_params: [],
      fields: [
        {
          name: 'metadata',
          type: '0x1::object::Object<0x1::fungible_asset::Metadata>',
        },
      ],
    },
    {
      name: 'PairCreation',
      is_native: false,
      is_event: true,
      abilities: ['drop', 'store'],
      generic_type_params: [],
      fields: [
        {
          name: 'coin_type',
          type: '0x1::type_info::TypeInfo',
        },
        {
          name: 'fungible_asset_metadata_address',
          type: 'address',
        },
      ],
    },
    {
      name: 'PairedCoinType',
      is_native: false,
      is_event: false,
      abilities: ['key'],
      generic_type_params: [],
      fields: [
        {
          name: 'type',
          type: '0x1::type_info::TypeInfo',
        },
      ],
    },
    {
      name: 'PairedFungibleAssetRefs',
      is_native: false,
      is_event: false,
      abilities: ['key'],
      generic_type_params: [],
      fields: [
        {
          name: 'mint_ref_opt',
          type: '0x1::option::Option<0x1::fungible_asset::MintRef>',
        },
        {
          name: 'transfer_ref_opt',
          type: '0x1::option::Option<0x1::fungible_asset::TransferRef>',
        },
        {
          name: 'burn_ref_opt',
          type: '0x1::option::Option<0x1::fungible_asset::BurnRef>',
        },
      ],
    },
    {
      name: 'SupplyConfig',
      is_native: false,
      is_event: false,
      abilities: ['key'],
      generic_type_params: [],
      fields: [
        {
          name: 'allow_upgrades',
          type: 'bool',
        },
      ],
    },
    {
      name: 'TransferRefReceipt',
      is_native: false,
      is_event: false,
      abilities: [],
      generic_type_params: [],
      fields: [
        {
          name: 'metadata',
          type: '0x1::object::Object<0x1::fungible_asset::Metadata>',
        },
      ],
    },
  ],
} as const;
