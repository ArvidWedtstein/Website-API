const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: "Role",
  description: "This represents a Role",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    icon: { type: GraphQLNonNull(GraphQLString) },
    color: { type: GraphQLNonNull(GraphQLString) },
    permissions: {
      type: new GraphQLList(GraphQLString),
      description: "All permissions of this role"
    },
    createdAt: { type: GraphQLNonNull(GraphQLString) },
    updatedAt: { type: GraphQLNonNull(GraphQLString) }
  })
})
