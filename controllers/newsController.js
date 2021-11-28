const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const newspostModel = require("../models/newspostModel");
const printModel = require('../models/printModel');
const projectModel = require('../models/projectModel');
const jwt = require("jsonwebtoken");
var Binary = require('mongodb').Binary;
const emailjs = require('emailjs-com');

/* News Posts/Blog */
exports.newspost = async (req, res, next) => {
  const body = JSON.parse(JSON.parse(JSON.stringify(req.body)).json); 
  const { title, description, author, tags } = body;
  const json = {
    title,
    description,
    author,
    tags
  }
  console.log(tags)
  if (req.file) {
    Object.assign(json, {image: req.file.path})
  }
  let result;
  try {
    const post = new newspostModel(json);
    result = await post.save();
  } catch (err) {
    console.error(err)
  }
 
  res.status(200).json({
    message: "Post created",
    post: { id: result.id, title: result.title, description: result.description, image: result.image, tags: result.tags },
  });
}

exports.getnewsposts = async (req, res, next) => {
  console.log('GET ALL NEWS POSTS')
  const posts = await newspostModel.find();
  //console.log(posts)
  res.status(200).json({
    posts: posts
  });
}
exports.getnewspost = async (req, res, next) => {
  const { id } = req.params;
  const posts = await newspostModel.find({ _id: id });
  //console.log(posts)
  res.status(200).json({
    posts: posts
  });
}

exports.deletenewsposts = async (req, res, next) => {
  const { id } = req.body
  console.log('delete post')
  const post = await newspostModel.findOneAndDelete({id: id});
  if (post) {
    res.status(404).json({
      message: "Post Not Found"
    });
  }
  res.status(200).json({
    message: "Successfully deleted post"
  });
}
