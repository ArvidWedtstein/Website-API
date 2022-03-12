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
  name: "Project",
  description: "This represents a Project",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    projectLink: { type: GraphQLString },
    thumbnail: { type: GraphQLString },
    tags: { type: GraphQLList(GraphQLString) },
    pain: { type: GraphQLInt },
    language: { type: GraphQLList(languageType) },
    hidden: { type: GraphQLBoolean },
    createdAt: { type: GraphQLNonNull(GraphQLString) },
    updatedAt: { type: GraphQLNonNull(GraphQLString) }
  })
})
