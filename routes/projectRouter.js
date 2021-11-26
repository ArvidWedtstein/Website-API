const express = require("express");
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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
    cb(null, "uploads/3dprint");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.stl`)
  }
})
const upload2 = multer({
  storage: storage2, 
  limits: {fileSize: 1024*1024*5}
});

//const upload = multer({ dest: 'uploads/' })
const projectController = require("../controllers/projectController");


router.post("/newProject", upload.single("thumbnail"), projectController.newProject);
router.get("/getProjects", projectController.getProjects);

// 3D Print \\
router.post("/newPrint", upload2.single("stl"), projectController.newPrint);
router.get("/getPrints", projectController.getPrints);
module.exports = router;