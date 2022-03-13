const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLFloat
} = require('graphql');
module.exports = new GraphQLObjectType({
  name: "Language",
  description: "Language",
  fields: () => ({
    name: { type: GraphQLString },
    percent: { type: GraphQLFloat }
  })
})