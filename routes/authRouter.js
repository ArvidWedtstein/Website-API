const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require('multer');
const jwt = require("jsonwebtoken");
require('dotenv').config()
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

router.post("/signin", authController.postSignin);
router.post("/login", authController.postLogin);
//router.delete("/logout", authController.postLogout);
router.get("/getUser", authController.getUser);
router.get("/getUserId/:id", authController.getUser);
router.get("/allusers", authController.getAllUsers);
router.post("/postUpdateuser", authenticateMiddleware, authController.postUpdateUser);
router.post("/changePassword", authenticateMiddleware, authController.changePassword);
router.post("/changePerms/:id", authenticateMiddleware, authController.changePerms);
router.post("/changeProfileimg", upload.single("profileimg"), authController.changeProfileimg);
router.get("/getRole/:id", authController.getRole);
router.get("/getRoles", authController.getRoles);
router.post("/banUser", authenticateMiddleware, authController.banUser);
router.post("/unbanUser", authenticateMiddleware, authController.unbanUser);

module.exports = router;