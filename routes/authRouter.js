const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require('multer');
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
require('dotenv').config()

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

router.get("/", (req, res, next) => {
  res.status(200).json(router.stack);
});



router.post("/signin", authController.postSignin);
router.post("/login", authController.postLogin);
router.delete("/logout", authController.postLogout);
router.post("/verificationcode", authController.verificationcode);
router.get("/getAllUserData/:id", authenticateMiddleware, authController.getAllUserData);
router.delete("/deleteAllUserData:/id", authenticateMiddleware, authController.deleteAllUserData);
router.get("/getUser", authController.getUser);
router.get("/getUserId/:id", authController.getUserId);
router.get("/allusers", authController.getAllUsers);
router.post("/postUpdateuser", authenticateMiddleware, authController.postUpdateUser);
router.post("/changePassword", authenticateMiddleware, authController.changePassword);
router.post("/changePerms/:id", authController.changePerms);
router.post("/changeProfileimg", authController.changeProfileimg);
router.post("/banUser", authenticateMiddleware, authController.banUser);
router.post("/unbanUser", authenticateMiddleware, authController.unbanUser);

router.post("/newRole", authenticateMiddleware, authController.newRole);
router.get("/getRole/:id", authController.getRole);
router.get("/getRoles", authController.getRoles);


module.exports = router;