const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const newspostModel = require("../models/newspostModel");
const printModel = require('../models/printModel');
const projectModel = require('../models/projectModel');
const jwt = require("jsonwebtoken");
var Binary = require('mongodb').Binary;
const emailjs = require('emailjs-com');


const perm = {
  CREATE_POST: "CREATE_POST",
  DELETE_POST: "DELETE_POST",
  MODIFY_POST: "MODIFY_POST",
  MODIFY_USERS: "MODIFY_USERS",
  VIEW_POST: "VIEW_POST",
  VIEW_PROJECTS: "VIEW_PROJECTS",
  CAN_CONTACT: "CAN_CONTACT",
  KICK_USER: "KICK_USER"
}
class Role {
  constructor(name, icon, permissions) {
    this.name = name;
    this.icon = icon;
    this.permissions = permissions;
  }
  get getpermissions() {
    return this.permissions
  }
}
const rankicons = {
  "Peasant": "fas fa-frog",
  "Tradesman": "fas fa-crow",
  "Knight": "fas fa-dragon",
  "Nobles": "fab fa-pied-piper-hat",
  "Preast": "fab fa-jenkins", 
  "Admin": "fab fa-wolf-pack-battalion"
}
const Peasant = new Role('Peasant', rankicons["Peasant"], [perm.VIEW_POST, perm.VIEW_PROJECTS])
const Tradesman = new Role('Tradesman', rankicons["Tradesman"], [perm.VIEW_POST, perm.VIEW_PROJECTS])
const Knight = new Role('Knight', rankicons["Knight"], [perm.VIEW_POST, perm.VIEW_PROJECTS])
const Nobles = new Role('Nobles', rankicons["Nobles"], [perm.VIEW_POST, perm.CREATE_POST, perm.VIEW_PROJECTS])
const Preast = new Role('Preast', rankicons["Preast"], [perm.VIEW_POST, perm.CREATE_POST, perm.MODIFY_POST, perm.VIEW_PROJECTS])
const Admin = new Role('Admin', rankicons["Admin"], [perm.VIEW_POST, perm.CREATE_POST, perm.DELETE_POST, perm.MODIFY_POST, perm.MODIFY_USERS, perm.VIEW_PROJECTS, perm.CAN_CONTACT, perm.KICK_USER])
const roles = {
  "Peasant": Peasant,
  "Tradesman": Tradesman,
  "Knight": Knight,
  "Nobles": Nobles,
  "Preast": Preast,
  "Admin": Admin
}
/* Signup */
let verificationcode;
exports.postSignin = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    /*if (verification != verification) {
      const error = new Error(
        "Verification token invalid"
      );
      res.status(409).json({
        error: "Verification token invalid/does not match",
      });
      error.statusCode = 409;
      throw error;
    }*/
    const existUser = await userModel.findOne({ email: email });
    if (existUser) {
      const error = new Error(
        "Email already exist, please pick another email!"
      );
      res.status(409).json({
        error: "Email already exist, please pick another email! ",
      });
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      role: Peasant
    });
    const result = await user.save();
    res.status(200).json({
      message: "User created",
      user: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
/* Log in */
let loadedUser;
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      const error = new Error("user with this email not found!");
      error.statusCode = 401;
      throw error;
    }
    if (user.banned == true) {
      const error = new Error("user is banned!");
      error.message = "User is banned!";
      error.statusCode = 418;
      throw error;
    }
    console.log(loadedUser)
    if (email == loadedUser.email) {
      const error = new Error("user is already logged in");
      error.statusCode = 417;
      throw error;
    }
    loadedUser = user;
    const comparePassword = await bcrypt.compare(password, user.password);
    
    if (!comparePassword) {
      const error = new Error("password does not match!");
      error.statusCode = 401;
      throw error;
      
    }
    console.log('login')
    const token = jwt.sign({ email: loadedUser.email }, "expressnuxtsecret", {
      expiresIn: "20m",
    });
    res.status(200).json({ token: token, message: "Successfully logged in" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
/* update user */
exports.postUpdateUser = async (req, res, next) => {
  const { role = loadedUser.role.name, email } = req.body;
  console.log(roles[role], email)
  try {
    const user = await userModel.findOneAndUpdate(
      {
        email: email
      },
      {
        role: roles[role]
      }
    )
    console.log(user)
    user.save()
    console.log(user)
    if (!user) {
      const error = new Error("user with this email not found!");
      error.statusCode = 401;
      throw error;
    }
    res.status(200).json({
      message: "Changes successful"
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.changePassword = async (req, res, next) => {
  const { password, repPassword } = req.body;
  try {
    if (password != repPassword) {
      const error = new Error("passwords don't match!");
      error.statusCode = 401;
      throw error;
    }
    if (password == "" || repPassword == "") {
      const error = new Error("passwords can't be empty");
      error.statusCode = 401;
      throw error;
    }
    if (password.match("^[a-zA-Z]+$") == false || repPassword.match("^[a-zA-Z0-9]+$") == false) {
      const error = new Error("One (or both) passwords contain invalid characters");
      error.statusCode = 401;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userModel.findOneAndUpdate(
      {
        email: loadedUser.email
      },
      {
        password: hashedPassword
      }
    )
    console.log(user)
    res.status(200).json({
      message: "Changed password"
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.changeProfileimg = async (req, res, next) => {
  console.log(req.file)
  try {
    const user = await userModel.findOneAndUpdate(
      {
        email: loadedUser.email
      },
      {
        profileimg: req.file.path
      }
    )
    loadedUser = user;
    res.status(200).json({
      message: "Changed profileimg"
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.banUser = async (req, res, next) => {
  console.log(req.body)
  try {
    const user = await userModel.findOneAndUpdate(
      {
        _id: req.body._id
      },
      {
        banned: true
      }
    )
    if (!user) {
      const error = new Error("user not found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "banned user"
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
exports.unbanUser = async (req, res, next) => {
  try {
    const user = await userModel.findOneAndUpdate(
      {
        _id: req.body._id
      },
      {
        banned: false
      }
    )
    if (!user) {
      const error = new Error("user not found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "unbanned user"
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
/* Roles */
exports.getRole = async (req, res, next) => {
  const { role } = req.body;
  try {
    res.status(200).json({
      message: "Found role",
      role: roles[role]
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getRoles = async (req, res, next) => {
  let rolest = []
  for (const key in roles) {
    rolest.push(roles[key])
  }
  res.status(200).json({
    roles: rolest
  });
}

/* Verification */
exports.sendVerificationCode = async (req, res, next) => {
  const { name, email, target } = req.body;
  verificationcode = "123456";
  try {
    emailjs.sendForm('service_5s4j6tk', 'template_2v29ddt', target, 'user_iJj06RAflifrwnzoXxkoy',{
      name: name,
      email: email,
      message: verificationcode
    }).then((result) => {

    })
    res.status(200).json({ message: "Verification code sent. Check your email", modal: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
exports.postLogout = async (req, res, next) => {
  console.log('plis sign out')

  try {
    res.status(200).json({ message: 'signed out' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getUser = (req, res, next) => {
  if (loadedUser) {
    res.status(200).json({
      user: {
        id: loadedUser._id,
        name: loadedUser.name,
        email: loadedUser.email,
        role: loadedUser.role,
        profileimg: loadedUser.profileimg
      },
    });
  }
};

exports.getAllUsers = async (req, res, next) => {
  console.log('GET ALL USERS')
  const users = await userModel.find();
  //console.log(users)
  res.status(200).json({
    users: users
  });
};



