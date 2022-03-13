const axios = require('axios');

/* MongoDB Models */
const reviewModel = require('../models/reviewModel');
const timelineModel = require('../models/timelineModel');
const projectModel = require('../models/projectModel');
const printModel = require('../models/printModel');
const newspostModel = require('../models/newspostModel');
const userModel = require('../models/userModel');

exports.newProject = async (name, description, projectLink, gitrepo, tags, pain, thumbnail) => {
  const userproject = {
    name: name,
    description: description,
    tags: tags,
    pain: pain,
  }

  if (projectLink) Object.assign(userproject, {projectLink: projectLink});

  if (thumbnail) Object.assign(userproject, {thumbnail: thumbnail});


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
      });
    });
  }
  const project = await new projectModel(userproject);
  const result = await project.save();

  return result;
}

/**
 * @param id string
 */
exports.deleteProject = async (id) => {
  if (!id) throw new Error("Invalid ID")

  const result = projectModel.findOneAndDelete({ _id: id })
  return result
}

exports.getProjects = async () => {
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
}

exports.newTimelineEvent = (name, description, startdate, enddate) => {
  const newtimelineevent = new timelineModel({
    name,
    description,
    startdate,
    enddate
  });
  
  const result = await newtimelineevent.save();
  return result;
}