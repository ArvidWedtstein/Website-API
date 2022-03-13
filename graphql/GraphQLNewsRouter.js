const { graphqlHTTP } = require("express-graphql");
const { NewspostType, UserType } = require('../graphql/Types')
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
  get: {
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
  },
  mutation: {
    newpost: {
      type: NewspostType,
      description: "Create a new news post.",
      args: {
        title: { type: GraphQLNonNull(GraphQLString), description: "Title of the news post" },
        description: { type: GraphQLNonNull(GraphQLString), description: "Description of the news post" },
        author: { type: GraphQLNonNull(GraphQLString), description: "Author of the news post" },
        sectionBlocks: { type: GraphQLString, description: "SectionBlocks of the post" },
        image: { type: GraphQLString, description: "Image of the news post?!" },
        tags: { type: GraphQLList(GraphQLString), description: "Tags for the news post" },
        reactions: { type: GraphQLList(GraphQLString), description: "Reactions for the news post" },
      },
      resolve: (async (parent, args) => {
        const { title, description, author, sectionBlocks, tags } = args;
        const json = {
          title,
          description,
          author,
          tags
        }
        if (args.image) {
          Object.assign(json, {image: args.image})
        }
        if (sectionBlocks) {
          Object.assign(json, {sectionBlocks})
        }
      
        const post = new newspostModel(json);
        let result = await post.save();
        return result;
      })
    }
  }
}