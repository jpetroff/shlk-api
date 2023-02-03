"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MixedResolver = exports.MixedTypeDef = exports.MixedType = void 0;
const graphql_1 = require("graphql");
exports.MixedType = new graphql_1.GraphQLScalarType({
    name: 'Mixed',
    description: 'Represents Mongo Mixed type',
    parseValue: toObject,
    serialize: toObject,
    parseLiteral: parseObject
});
exports.MixedTypeDef = `scalar Mixed`;
exports.MixedResolver = {
    Mixed: exports.MixedType
};
function toObject(value) {
    if (typeof value === 'object') {
        return value;
    }
    if (typeof value === 'string' && value.charAt(0) === '{') {
        return JSON.parse(value);
    }
    return null;
}
function parseObject(_ast) {
    const ast = _ast;
    if (!(ast === null || ast === void 0 ? void 0 : ast.fields))
        return undefined;
    const value = Object.create(null);
    ast.fields.forEach((field) => {
        value[field.name.value] = parseAst(field.value);
    });
    return value;
}
function parseAst(ast) {
    switch (ast.kind) {
        case graphql_1.Kind.BOOLEAN:
        case graphql_1.Kind.STRING:
            return ast.value;
        case graphql_1.Kind.INT:
        case graphql_1.Kind.FLOAT:
            return Number(ast.value);
        case graphql_1.Kind.LIST:
            return ast.values.map(parseAst);
        case graphql_1.Kind.OBJECT:
            return parseObject(ast);
        case graphql_1.Kind.NULL:
            return null;
        default:
            throw new Error(`Unexpected kind in parseLiteral: ${ast.kind}`);
    }
}
//# sourceMappingURL=extends.js.map