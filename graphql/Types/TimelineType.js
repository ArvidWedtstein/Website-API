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

  module.exports = new GraphQLObjectType({
    name: "Timeline",
    description: "This represents a Timeline Event",
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      name: { type: GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLNonNull(GraphQLInt), description: "A description of the event" },
      startdate: { type: GraphQLNonNull(GraphQLString), description: "Start Date of the event in DD/MM/YYYY format" },
      enddate: { type: GraphQLNonNull(GraphQLString), description: "End Date of the event in DD/MM/YYYY format" },
      createdAt: { type: GraphQLNonNull(GraphQLString) },
      updatedAt: { type: GraphQLNonNull(GraphQLString) }
    })
  })
  