import { GraphQLScalarType, Kind, ValueNode, ObjectValueNode, GraphQLError, IntValueNode } from 'graphql'

export const MixedType = new GraphQLScalarType({
  name: 'Mixed',
  description: 'Represents Mongo Mixed type',
  parseValue: toObject,
  serialize: toObject,
  parseLiteral: parseObject
})

export const MixedTypeDef = `scalar Mixed`

export const MixedResolver = {
  Mixed: MixedType
}

function toObject(value:unknown) : Maybe<AnyObject> {
  if(typeof value === 'object') {
    return value;
  }
  if(typeof value === 'string' && value.charAt(0) === '{') {
      return JSON.parse(value);
  }
  return null;
}

function parseObject(_ast: ValueNode):Maybe<AnyObject> {
  const ast : ObjectValueNode = (_ast as ObjectValueNode)
  if(!ast?.fields) return undefined

  const value = Object.create(null);
  ast.fields.forEach((field:any) => {
      value[field.name.value] = parseAst(field.value);
  });
  return value;
}

function parseAst(ast:ValueNode):unknown {
  switch (ast.kind) {
    case Kind.BOOLEAN:
    case Kind.STRING:  
      return ast.value
    case Kind.INT:
    case Kind.FLOAT:
      return Number(ast.value)
    case Kind.LIST:
      return ast.values.map(parseAst)
    case Kind.OBJECT:
      return parseObject(ast)
    case Kind.NULL:
        return null
    default:
      throw new Error(`Unexpected kind in parseLiteral: ${ast.kind}`)
  }
}

export function resolveError(error: any) : any {
  if(error instanceof GraphQLError) { return error } 
  else {
    return new GraphQLError(
      error.message || String(error), 
      { extensions: error.meta || { code: 'UNKNOWN_ERROR' } }
    )
  }
}

/* 
  Big Integer for Date.valueOf()
*/

export const LongType = new GraphQLScalarType({
  name: 'Long',
  description: 'The `Long` scalar type represents 52-bit integers',
  serialize: coerceLong,
  parseValue: coerceLong,
  parseLiteral: parseLiteral,
})

export const LongTypeDef = `scalar Long`

export const LongResolver = {
  Long: LongType
}

const MAX_LONG = Number.MAX_SAFE_INTEGER
const MIN_LONG = Number.MIN_SAFE_INTEGER

function coerceLong(value: unknown) : Maybe<number> {
  if(!value)
      throw new TypeError('Long cannot represent non 52-bit signed integer value')
  const num = Number(value)
  if(num == num && num <= MAX_LONG && num >= MIN_LONG)
      return num < 0 ? Math.ceil(num) : Math.floor(num)
  throw new TypeError(`Long cannot represent non 52-bit signed integer value: ${value}`)
}

function parseLiteral(ast: ValueNode) : unknown {
  if(ast.kind == Kind.INT) {
    const num = parseInt(ast.value, 10)
    if(num <= MAX_LONG && num >= MIN_LONG)
        return num
    return null
  }
  return null
}