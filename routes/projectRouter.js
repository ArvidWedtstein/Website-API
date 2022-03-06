const express = require("express");
const router = express.Router();
const multer = require('multer');
const jwt = require("jsonwebtoken");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`)
  }
})
const upload = multer({
  storage: storage, 
  limits: {fileSize: 1024*1024*5}
});
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/uploads/3dprint");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.stl`)
  }
})
const authenticateMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ")[1];
  // console.log(token)
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, 'expressnuxtsecret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user
    next();
  })
};

//const upload = multer({ dest: 'uploads/' })
const projectController = require("../controllers/projectController");


//router.post("/newProject", upload.single("thumbnail"), projectController.newProject);
router.post("/newProject", projectController.newProject);
router.get("/getProjects", projectController.getProjects);
router.post("/hideProject", projectController.hideProject);
router.delete("/deleteProject", projectController.deleteProject);

// 3D Print \\
router.get("/getPrints", projectController.getPrints);
router.get("/getPrint/:id", projectController.getPrint);

// Rating \\
router.post("/newRating", projectController.newRating);
router.get("/getRatings", projectController.getRatings);
router.post("/editRating/:id", authenticateMiddleware, projectController.editRating);

// About Me Page Timeline
router.post("/newTimelineEvent", projectController.newTimelineEvent);
router.get("/getTimelineEvents", projectController.getTimeline);
module.exports = router;