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
  get: {
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
      resolve: async () => await userModel.find()
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
      resolve: async () => await roleModel.find()
    },
  },
  mutation: {
    newrole: {
      type: RoleType,
      description: "Create a new role",
      args: {
        name: { type: GraphQLNonNull(GraphQLString), description: "Name of the Role" },
        icon: { type: GraphQLNonNull(GraphQLString), description: "Icon of the Role" },
        color: { type: GraphQLNonNull(GraphQLString), description: "Color of the Role" },
        permissions: { type: GraphQLList(GraphQLString), description: "Permissions of the Role" },
      },
      resolve: (async (parent, args) => {
        const { name, icon, color, permissions } = args;
        const role = new roleModel({
          name: name,
          icon: icon,
          color: color,
          permissions: permissions
        });
        const result = await role.save();
        return result;
      })
    }
  }
}