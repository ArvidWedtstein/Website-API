const { graphqlHTTP } = require("express-graphql");
const { RoleType } = require('../graphql/Types')
const roleModel = require("../models/roleModel");
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
  news: {
    type: RoleType,
    description: "A Single Role",
    args: {
      _id: { type: GraphQLString },
    },
    resolve: (async (parent, args) => {
      const roleData = await roleModel.find({ _id: args._id })
      return roleData[0]
    })
  }
}