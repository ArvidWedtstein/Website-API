const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const newspostModel = require("../models/newspostModel");
const printModel = require('../models/printModel');
const projectModel = require('../models/projectModel');
const reviewModel = require('../models/reviewModel');
const jwt = require("jsonwebtoken");
var Binary = require('mongodb').Binary;
const emailjs = require('emailjs-com');
const axios = require('axios');


exports.newProject = async (req, res, next) => {
  try {
    //const json = JSON.parse(JSON.parse(JSON.stringify(req.body)).json); 
    //const { name, description, projectLink, gitrepo, tags, pain } = json;
    const { name, description, projectLink, gitrepo, tags, pain } = req.body;
    const userproject = {
      name: name,
      description: description,
      tags: tags,
      pain: pain,
    }
    if (projectLink) {
      Object.assign(userproject, {projectLink: projectLink});
    }
    if (req.file) {
      Object.assign(userproject, {thumbnail: req.file.path});
    }
    if (gitrepo) {
      axios({
        method: "get",
        url: "https://api.github.com/users/ArvidWedtstein/repos"
      }).then(async (gitres) => {
        let proj = gitres.data.find(proje => proje.html_url === gitrepo)
        await axios({
          method: "get",
          url: proj.languages_url
        }).then(async (langres) => {
          let lang = await langres.data;
          const sumValues = lang => Object.values(lang).reduce((a, b) => a + b);
          const percentage = (partialValue, totalValue) => {
            return (100 * partialValue) / totalValue;
          } 
          let percent = []
          for (const language in lang) {
            percent.push({ "name": language, "percent": Math.round(percentage(lang[language], sumValues(lang)) * 100) / 100})
          }
          Object.assign(userproject, {language: percent})
          Object.assign(userproject, {github: proj})
          console.log(userproject)
          const project = await new projectModel(userproject);
          const result = await project.save();
        });
      });
    } else {
      const project = await new projectModel(userproject);
      const result = await project.save();
    }
    res.status(200).json({
      message: "Project created"
    });
  } catch (err) {
    console.log(err)
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
exports.getProjects = async (req, res, next) => {
  let projects = await projectModel.find();

  axios({
    method: "get",
    url: "https://api.github.com/users/ArvidWedtstein/repos"
  }).then(async (gitres) => {
    projects.forEach (async (project) => {
      if (project.github) {
        let proj = gitres.data.find(proje => proje.url === project.github.url)
        const projectupdate = await projectModel.findOneAndUpdate(
          {
            _id: project.Id,
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
      }
    })
  })
  projects = await projectModel.find();
  res.status(200).json({
    projects: projects
  });
}

exports.newRating = async (req, res, next) => {
  try {
    const { author, rating, review } = req.body;
    const reviewDB = new reviewModel({
      author,
      rating,
      review
    });
    
    const result = await reviewDB.save();
    res.status(200).json({
      message: "Review Created"
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
  
exports.getRatings = async (req, res, next) => {
  const reviews = await reviewModel.find();
  //console.log(reviews)
  res.status(200).json({
    reviews
  });
}

exports.editRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('editRATING')
    const { user, review, rating } = req.body
    if (!id) {
      const error = new Error("invalid ID!");
      error.statusCode = 404;
      throw error;
    }
    const DBreview = await reviewModel.findOneAndUpdate(
      {
        _id: id
      }, 
      {
        author: user,
        rating: rating,
        review: review
      }
    )
    if (!DBreview) {
      const error = new Error("review not found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Review Edited Successfully"
    });
  } catch (err) {
    console.log(err)
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
  
/* 3D print */
exports.newPrint = async (req, res, next) => {
  const json = JSON.parse(JSON.parse(JSON.stringify(req.body)).json); 
  const { name, description, author } = json;
  const post = new printModel({
    name: name,
    description: description,
    author: author,
    stl: req.file.path
  });
  const result = await post.save();
  res.status(200).json({
    message: "Print created",
    print: { id: result.id, title: result.name, description: result.description },
  });
}


exports.getPrints = async (req, res, next) => {
  const prints = await printModel.find();
  //console.log(prints)
  res.status(200).json({
    prints: prints
  });
}

exports.getPrint = async (req, res, next) => {
  const { id } = req.params;
  const print = await printModel.find({ _id: id });
  //console.log(prints)
  res.status(200).json({
    prints: print
  });
}
