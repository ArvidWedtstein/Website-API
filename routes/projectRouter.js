import jwt from 'jsonwebtoken'
import express from 'express'
const router = express.Router();

const authenticateMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, 'expressnuxtsecret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user
    next();
  })
};

const projectController = require("../controllers/projectController");


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

// About Me Page Timeline \\
router.post("/newTimelineEvent", projectController.newTimelineEvent);
router.get("/getTimelineEvents", projectController.getTimeline);

export default router;