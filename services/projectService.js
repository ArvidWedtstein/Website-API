const axios = require('axios');
const projectModel = require("../models/projectModel");

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