const express = require("express");
const router = express.Router();
const newsController = require('../controllers/newsController');

/* Routes */
router.post("/newspost", newsController.newspost);
router.get("/getnewsposts", newsController.getnewsposts);
router.get("/getnewspost/:id", newsController.getnewspost);
router.get("/getnewspostuser/:name", newsController.getnewspostuser);
router.delete("/deletenewspost", newsController.deletenewsposts);

module.exports = router;