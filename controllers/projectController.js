const axios = require('axios');
/* MongoDB Models */
const reviewModel = require('../models/reviewModel');
const timelineModel = require('../models/timelineModel');
const projectModel = require('../models/projectModel');
const printModel = require('../models/printModel');
const newspostModel = require('../models/newspostModel');
const userModel = require('../models/userModel');
/* Services */
const projectService = require('../services/projectService');

exports.newProject = async (req, res, next) => {
  try {
    const { name, description, projectLink, gitrepo, tags, pain } = req.body;

    const result = projectService.newProject(name, description, projectLink, gitrepo, tags, pain, req.file)
    // const userproject = {
    //   name: name,
    //   description: description,
    //   tags: tags,
    //   pain: pain,
    // }

    // if (projectLink) Object.assign(userproject, {projectLink: projectLink});

    // if (req.file) Object.assign(userproject, {thumbnail: req.file.path});


    // if (gitrepo) {
    //   axios({
    //     method: "get",
    //     url: "https://api.github.com/users/ArvidWedtstein/repos"
    //   }).then(async (gitres) => {
    //     let proj = gitres.data.find(proje => proje.html_url === gitrepo)
    //     await axios({
    //       method: "get",
    //       url: proj.languages_url
    //     }).then(async (langres) => {
    //       let lang = await langres.data;
    //       const sumValues = lang => Object.values(lang).reduce((a, b) => a + b);
    //       const percentage = (partialValue, totalValue) => {
    //         return (100 * partialValue) / totalValue;
    //       } 
    //       let percent = []
    //       for (const language in lang) {
    //         percent.push({ "name": language, "percent": Math.round(percentage(lang[language], sumValues(lang)) * 100) / 100})
    //       }
    //       Object.assign(userproject, {language: percent})
    //       Object.assign(userproject, {github: proj})
    //     });
    //   });
    // }
    // const project = await new projectModel(userproject);
    // const result = await project.save();

    res.status(200).json({
      message: "Project created",
      data: result
    });
  } catch (err) {
    console.log(err)
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.hideProject = async (req, res, next) => {
  try {
    const { id, isHidden } = req.body;
    const hiddenProject = await projectModel.findOneAndUpdate(
      {
        _id: id
      },
      {
        hidden: isHidden
      }
    )
    hiddenProject.save();


    if (!hiddenProject) {
      const error = new Error("could not hide project");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Project updated",
      data: hiddenProject
    });
  } catch (err) {
    console.log(err)
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.body;
    projectModel.findOneAndDelete({ _id: id })
      
    res.status(200).json({
      message: "Project deleted"
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
  let projects = await projectService.getProjects();
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
      message: "Review Created",
      data: result
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
  
exports.getRatings = async (req, res, next) => {
  try {
    const reviews = await reviewModel.find();

    res.status(200).json({
      reviews
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.editRating = async (req, res, next) => {
  try {
    const { id } = req.params;
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
  try {
    const json = JSON.parse(JSON.parse(JSON.stringify(req.body)).json); 
    const { name, description, author } = json;
    const print = new printModel({
      name: name,
      description: description,
      author: author,
      stl: req.file.path
    });

    const result = await print.save();
    res.status(200).json({
      message: "Print created",
      print: result,
    });
  } catch (err) {
    console.log(err)
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


exports.getPrints = async (req, res, next) => {
  const prints = await printModel.find();
  //console.log(prints)
  res.status(200).json({
    prints: prints
  });
}

exports.getPrint = async (req, res, next) => {
  try {
    const { id } = req.params;

    const print = await printModel.find({ _id: id });

    if (!print) {
      const error = new Error("print not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      prints: print
    });
  } catch (err) {
    console.log(err)
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

/* About Me Page Timeline */
exports.getTimeline = async (req, res, next) => {
  try {
    const timeline = await timelineModel.find();

    if (!timeline) {
      res.status(204).json({
        message: "Could not find timeline Events"
      });
    }

    res.status(200).json({
      timeline: timeline
    });
  } catch (err) {
    console.log(err)
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.newTimelineEvent = async (req, res, next) => {
  try {
    const { name, description, startdate, enddate } = req.body;
    const newtimelineevent = new timelineModel({
      name,
      description,
      startdate,
      enddate
    });
    
    const result = await newtimelineevent.save();
    res.status(200).json({
      message: "Timeline Event Created",
      timeline: result
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}