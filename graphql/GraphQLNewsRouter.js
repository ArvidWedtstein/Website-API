const { graphqlHTTP } = require("express-graphql");
const { NewspostType } = require('../graphql/Types')
const newspostModel = require("../models/newspostModel");
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
  newspost: {
    type: NewspostType,
    description: "A Single News Post",
    args: {
      _id: { type: GraphQLString },
    },
    resolve: (async (parent, args) => {
      const newspostData = await newspostModel.find({ _id: args._id })
      return newspostData[0]
    })
  },
  newsposts: {
    type: GraphQLList(NewspostType),
    description: "Returns all news posts",
    resolve: (async () => await newspostModel.find())
  }
}