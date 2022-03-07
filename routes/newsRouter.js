const express = require("express");
const router = express.Router();
const newsController = require('../controllers/newsController');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/newspost/`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`)
  }
})
const upload = multer({
  storage: storage, 
  limits: {fileSize: 1024*1024*5}
});

router.get("/", (req, res, next) => {
  res.status(200).json(router.stack);
});

router.post("/newspost", newsController.newspost);
// router.post("/newspost", upload.single("image"), newsController.newspost);
router.get("/getnewsposts", newsController.getnewsposts);
router.get("/getnewspost/:id", newsController.getnewspost);
router.get("/getnewspostuser/:name", newsController.getnewspostuser);
router.delete("/deletenewspost", newsController.deletenewsposts);
module.exports = router;