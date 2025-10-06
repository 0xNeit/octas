import { Abi } from "../abi";
import { Struct } from "./structs";

type Event<T extends Abi> = Extract<Struct<T>, { is_event: true }>;

type EventName<T extends Abi> = Event<T>['name'];

type ExtractEvent<T extends Abi, TEventName extends EventName<T>> = Extract<
  Event<T>,
  { name: TEventName }
>;

export type ExtractEventFieldsName<
  T extends Abi,
  TEventName extends EventName<T>,
> = ExtractEvent<T, TEventName>['fields'][number]['name'];

export type ExtractEventFieldMoveType<
  T extends Abi,
  TEventName extends EventName<T>,
  TFieldName extends string,
> = Extract<
  ExtractEvent<T, TEventName>['fields'][number],
  { name: TFieldName }
>['type'];