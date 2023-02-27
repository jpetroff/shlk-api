declare module "random-hash"
declare module "mongoose-beautiful-unique-validation"
declare module "config"

declare type Maybe<T> = T | undefined | null

declare type AnyObject = { [key: string]: any }

declare type Args<T> = { args: T }