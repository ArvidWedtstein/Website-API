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
const LanguageType = require('./LanguageType')
const roleModel = require('../../models/roleModel')
module.exports = new GraphQLObjectType({
  name: "Project",
  description: "This represents a Project",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    projectLink: { type: GraphQLString },
    github: { type: GraphQLList(GraphQLString) },
    thumbnail: { type: GraphQLString },
    tags: { type: GraphQLList(GraphQLString) },
    pain: { type: GraphQLInt },
    language: { type: GraphQLList(LanguageType) },
    hidden: { type: GraphQLBoolean },
    createdAt: { type: GraphQLNonNull(GraphQLString) },
    updatedAt: { type: GraphQLNonNull(GraphQLString) }
  })
})
