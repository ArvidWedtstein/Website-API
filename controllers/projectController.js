const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const newspostModel = require("../models/newspostModel");
const printModel = require('../models/printModel');
const projectModel = require('../models/projectModel');
const reviewModel = require('../models/reviewModel');
const jwt = require("jsonwebtoken");
var Binary = require('mongodb').Binary;
const emailjs = require('emailjs-com');



exports.newProject = async (req, res, next) => {
  try {
    const json = JSON.parse(JSON.parse(JSON.stringify(req.body)).json); 
    const { name, description, projectLink, gitrepo, tags, pain } = json;
    const project = new projectModel({
      name,
      description,
      projectLink,
      gitrepo,
      thumbnail: req.file.path,
      tags,
      pain
    });
    
    const result = await project.save();
    res.status(200).json({
      message: "Project created"
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
exports.getProjects = async (req, res, next) => {
  const projects = await projectModel.find();
  res.status(200).json({
    projects: projects
  });
}

exports.newRating = async (req, res, next) => {
  try {
    const { author, rating } = req.body;
    const project = new reviewModel({
      author,
      rating
    });
    
    const result = await project.save();
    res.status(200).json({
      message: "Project created"
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
  res.status(200).json({
    reviews
  });
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
