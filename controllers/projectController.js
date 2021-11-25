const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const newspostModel = require("../models/newspostModel");
const printModel = require('../models/printModel');
const projectModel = require('../models/projectModel');
const jwt = require("jsonwebtoken");
var Binary = require('mongodb').Binary;
const emailjs = require('emailjs-com');



exports.newProject = async (req, res, next) => {
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
    
    //res.sendFiles
    const result = await project.save();
    res.status(200).json({
      message: "Project created",
      //print: { id: result.id, title: result.name, description: result.description },
    });
  }
  exports.getProjects = async (req, res, next) => {
    const projects = await projectModel.find();
    res.status(200).json({
      projects: projects
    });
  }


  
/* 3D print */
exports.newPrint = async (req, res, next) => {
  const { name, description, author, stl } = req.body;
  console.log(req.body)
  const post = new printModel({
    name: name,
    description: description,
    author: author,
    stl: stl
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
