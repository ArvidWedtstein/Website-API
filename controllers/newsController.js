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
  console.log(req.body)
  const body = req.body;
  //const body = JSON.parse(JSON.parse(JSON.stringify(req.body)).json); 
  try {
    const { title, description, author, sectionBlocks, tags } = body;
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
    if (sectionBlocks) {
      Object.assign(json, {sectionBlocks})
    }
  
    const post = new newspostModel(json);
    let result = await post.save();

     
    res.status(200).json({
      message: "Post created",
      post: result
    });
  } catch (err) {
    console.log(err)
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getnewsposts = async (req, res, next) => {
  console.log('GET ALL NEWS POSTS')
  let posts = await newspostModel.find();
  const users = await userModel.find();
  posts.forEach(async (post) => {
    post.author = users.find(user => user.id === post.author);
  });
  // console.log(posts)
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
exports.getnewspostuser = async (req, res, next) => {
  const { name } = req.params;
  const posts = await newspostModel.find({ 'author.name': name });
  //console.log(posts)
  res.status(200).json({
    posts: posts
  });
}

exports.deletenewsposts = async (req, res, next) => {
  const { id } = req.body
  console.log('delete post')
  const post = await newspostModel.findOneAndDelete({id: id});
  if (!post) {
    res.status(404).json({
      message: "Post Not Found"
    });
  }
  res.status(200).json({
    message: "Successfully deleted post"
  });
}
