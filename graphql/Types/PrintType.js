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
    name: "Print",
    description: "This represents a 3D Print",
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString), description: "This is a ID" },
      name: { type: GraphQLNonNull(GraphQLString), description: "This is a Name" },
      description: { type: GraphQLNonNull(GraphQLString), description: "This is a Description" },
      author: { type: GraphQLNonNull(GraphQLString) },
      stl: { type: GraphQLString },
      createdAt: { type: GraphQLNonNull(GraphQLString) },
      updatedAt: { type: GraphQLNonNull(GraphQLString) }
    })
  })
  