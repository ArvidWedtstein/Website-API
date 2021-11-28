const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/profileimgs/`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`)
  }
})
const upload = multer({
  storage: storage, 
  limits: {fileSize: 1024*1024*5}
});

router.post("/signin", authController.postSignin);
router.post("/login", authController.postLogin);
//router.delete("/logout", authController.postLogout);
router.get("/getUser/:id", authController.getUser)
router.get("/allusers", authController.getAllUsers);
router.post("/postUpdateuser", authController.postUpdateUser);
router.post("/changePassword", authController.changePassword);
router.post("/changeProfileimg", upload.single("profileimg"), authController.changeProfileimg);
router.post("/getRole", authController.getRole);
router.get("/getRoles", authController.getRoles);
router.post("/banUser", authController.banUser);
router.post("/unbanUser", authController.unbanUser);

//router.post("/verification", authController.sendVerificationCode);
module.exports = router;