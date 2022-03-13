const { graphqlHTTP } = require("express-graphql");
/* MongoDB Models */
const userModel = require("../models/userModel");
const projectModel = require("../models/projectModel");
const reviewModel = require("../models/reviewModel");
const timelineModel = require("../models/timelineModel");
/* Services */
const projectService = require('../services/projectService')

const axios = require('axios');
const { RoleType, UserType, ProjectType, PrintType, TimelineType, RatingType, LanguageType } = require('./Types/index')
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
    project: {
      type: ProjectType,
      description: "A Single Project",
      args: {
        _id: { type: GraphQLString }
      },
      resolve: (async (parent, args) => {
        const project = await projectModel.find({ _id: args._id })
        return project[0]
      })
    },
    projects: {
      type: new GraphQLList(ProjectType),
      description: "List of all projects",
      resolve: (async () => {
        let projects = await projectModel.find();

        /* Implement GraphQL to only get necessary data from github */
        axios({
          method: "get",
          url: "https://api.github.com/users/ArvidWedtstein/repos"
        }).then(async (gitres) => {
          projects.forEach (async (project) => {
            if (project.github) {
              let proj = gitres.data.find(proje => proje.url === project.github.url)
              const projectupdate = await projectModel.findOneAndUpdate(
                {
                  _id: project.id,
                },
                {
                  github: proj
                }
              )
              if (!projectupdate) {
                const error = new Error("project not found!");
                error.statusCode = 404;
                throw error;
              }
              project = projectupdate;
            }
          })
        })
        return projects
      })
    },
    print: {
      type: PrintType,
      description: "This spits out a Single 3D Print",
      args: {
        _id: { type: GraphQLString, description: "This requires an id" }
      },
      resolve: (async (parent, args) => {
        const print = await printModel.find({ _id: args._id })
        return print[0]
      })
    },
    prints: {
      type: GraphQLList(PrintType),
      description: "All Prints",
      resolve: (async () => {
        const prints = await printModel.find();
        return prints
      })
    },
    timelineEvent: {
      type: TimelineType,
      description: "A Single Timeline Event",
      args: {
        _id: { type: GraphQLString, description: "This requires an id" }
      },
      resolve: (async (parent, args) => {
        const timelineevent = await timelineModel.find({ _id: args._id })
        return timelineevent[0]
      })
    },
    timelineEvents: {
      type: GraphQLList(TimelineType),
      description: "This spits out all Timeline Event",
      resolve: (async () => await timelineModel.find())
    },
    rating: {
      type: RatingType,
      description: "This spits out a Single Review",
      args: {
        _id: { type: GraphQLString, description: "This requires an id (24 length)" }
      },
      resolve: (async (parent, args) => {
        const review = await reviewModel.find({ _id: args._id })
        return review[0]
      })
    },
    ratings: {
      type: GraphQLList(RatingType),
      description: "This gives you all reviews",
      resolve: (async () => reviewModel.find())
    }
  },
  mutation: {
    newProject: {
      type: ProjectType,
      description: "Create a new Project",
      args: {
        name: { type: GraphQLNonNull(GraphQLString), description: "Name of the Project" },
        description: { type: GraphQLNonNull(GraphQLString), description: "Description of the Project" },
        projectLink: { type: GraphQLString, description: "Link to the Project" },
        github: { type: GraphQLString, description: "Link to the Github Repository for the Project" },
        thumbnail: { type: GraphQLString, description: "Image to the Project" },
        tags: { type: GraphQLList(GraphQLString), description: "Tags to the Project" },
        pain: { type: GraphQLInt, description: "Amount of pain" },
        hidden: { type: GraphQLBoolean },
      },
      resolve: (async (parent, args) => {
        const { name, description, projectLink, github, tags, pain } = args;

        const result = await projectService.newProject(name, description, projectLink, github, tags, pain, args.thumbnail)

        return result;
      })
    }
  }
}