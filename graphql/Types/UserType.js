const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');
const RoleType = require('./RoleType')
const roleModel = require('../../models/roleModel')

module.exports = new GraphQLObjectType({
  name: "User",
  description: "This represents a User",
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLNonNull(GraphQLString) },
    roleData: {
      type: RoleType,
      resolve: (async (role) => {
        const roleData = await roleModel.find({ _id: role.role })
        return roleData[0]
      })
    },
    banned: { 
      type: GraphQLBoolean,
      description: "If user is banned"
    },
    createdAt: { type: GraphQLNonNull(GraphQLString) },
    updatedAt: { type: GraphQLNonNull(GraphQLString) }
  })
})
