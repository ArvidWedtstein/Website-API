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
  const RoleType = require('./RoleType')
  const roleModel = require('../../models/roleModel')
  const languageType = new GraphQLObjectType({
    name: "Language",
    description: "Language",
    fields: () => ({
      name: { type: GraphQLString },
      percent: { type: GraphQLFloat }
    })
  })
  module.exports = new GraphQLObjectType({
    name: "Rating",
    description: "This represents a Rating",
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      author: { type: GraphQLNonNull(GraphQLString) },
      rating: { type: GraphQLNonNull(GraphQLInt), description: "Star Rating from 1-5" },
      review: { type: GraphQLNonNull(GraphQLString), description: "Review Text" },
      createdAt: { type: GraphQLNonNull(GraphQLString) },
      updatedAt: { type: GraphQLNonNull(GraphQLString) }
    })
  })
  