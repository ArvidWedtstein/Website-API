const { graphqlHTTP } = require("express-graphql");
const userModel = require("../models/userModel");
const roleModel = require("../models/roleModel");
const { RoleType, UserType } = require('./Types/index')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');

module.exports = {
  user: {
    type: UserType,
    description: "A Single User",
    args: {
      _id: { type: GraphQLString }
    },
    resolve: (async (parent, args) => {
      const user = await userModel.find({ _id: args._id })
      return user[0]
    })
  },
  users: {
    type: new GraphQLList(UserType),
    description: "List of all users",
    resolve: () => userModel.find()
  },
  role: {
    type: RoleType,
    description: "A Single Role",
    args: {
      _id: { type: GraphQLString },
    },
    resolve: (async (parent, args) => {
      const roleData = await roleModel.find({ _id: args._id })
      return roleData[0]
    })
  },
  roles: {
    type: new GraphQLList(RoleType),
    description: "List of all roles",
    resolve: () => roleModel.find()
  },
}