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


router.post("/newspost", upload.single("image"), newsController.newspost);
router.get("/getnewsposts", newsController.getnewsposts);
router.delete("/deletenewspost", newsController.deletenewsposts);
module.exports = router;