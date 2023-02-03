import { GraphQLScalarType, Kind, ValueNode, ObjectValueNode } from 'graphql'

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