const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const newspostModel = require("../models/newspostModel");
const printModel = require('../models/printModel');
const projectModel = require('../models/projectModel');
const reviewModel = require("../models/reviewModel");
const roleModel = require("../models/roleModel");
const jwt = require("jsonwebtoken");
const fs = require('fs');
var Binary = require('mongodb').Binary;
const emailjs = require('emailjs-com');
require('dotenv').config()
const axios = require('axios');
const ObjectId = require('mongodb').ObjectId;
const { LEGAL_TCP_SOCKET_OPTIONS } = require("mongoose/node_modules/mongodb");
const { LEGAL_TLS_SOCKET_OPTIONS } = require("mongodb");
const perm = {
  CREATE_POST: "CREATE_POST",
  DELETE_POST: "DELETE_POST",
  MODIFY_POST: "MODIFY_POST",
  MODIFY_USERS: "MODIFY_USERS",
  VIEW_POST: "VIEW_POST",
  VIEW_PROJECTS: "VIEW_PROJECTS",
  CREATE_PROJECT: "CREATE_PROJECT",
  HIDE_PROJECT: "HIDE_PROJECT",
  CAN_CONTACT: "CAN_CONTACT",
  KICK_USER: "KICK_USER"
}
class Role {
  constructor(name, icon, color, permissions) {
    this.name = name;
    this.icon = icon;
    this.color = color;
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
const Peasant = new Role('Peasant', rankicons["Peasant"], "#42210C", [perm.VIEW_POST, perm.VIEW_PROJECTS])
const Tradesman = new Role('Tradesman', rankicons["Tradesman"], "#279e00",[perm.VIEW_POST, perm.VIEW_PROJECTS])
const Knight = new Role('Knight', rankicons["Knight"], "#727272", [perm.VIEW_POST, perm.VIEW_PROJECTS])
const Nobles = new Role('Nobles', rankicons["Nobles"], "#6d0821", [perm.VIEW_POST, perm.CREATE_POST, perm.VIEW_PROJECTS])
const Preast = new Role('Preast', rankicons["Preast"], "#87049b", [perm.VIEW_POST, perm.CREATE_POST, perm.MODIFY_POST, perm.VIEW_PROJECTS, perm.KICK_USER])
const Admin = new Role('Admin', rankicons["Admin"], "#dc3545", [perm.VIEW_POST, perm.CREATE_POST, perm.DELETE_POST, perm.MODIFY_POST, perm.MODIFY_USERS, perm.VIEW_PROJECTS, perm.CAN_CONTACT, perm.KICK_USER, perm.CREATE_PROJECT, perm.HIDE_PROJECT])
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
    const peasantroleid = "61e54d738d85aacb59ce3338"
    //const hashedPassword = await bcrypt.hash(password, 12);
    const user = new userModel({
      name: name,
      email: email,
      password: password || password.hash,
      role: peasantroleid
    });
    const result = await user.save();
    res.status(200).json({
      message: "User created",
      user: result,
    });
  } catch (err) {
    console.log(err)
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
    loadedUser = user;
    const comparePassword = await bcrypt.compare(password, user.password);
    
    if (!comparePassword) {
      const error = new Error("password does not match!");
      error.statusCode = 401;
      throw error;
      
    }
    const token = jwt.sign({ email: loadedUser.email }, "expressnuxtsecret", {
      expiresIn: "20m",
    });
    res.status(200).json({ token: token, message: "Successfully logged in", user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.verificationcode = async (req, res, next) => {
  const { name, email } = req.body;
  await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
    service_id: "service_5s4j6tk",
    template_id: "template_2v29ddt",
    user_id: "user_iJj06RAflifrwnzoXxkoy"
  }).then(async (mail) => {
    console.log(mail)
    res.status(200).json({
      message: "Changes successful",
      data: mail
    })
  })
}

/* update user */
exports.postUpdateUser = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization)
  const { role, email } = req.body;
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
    user.save()
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
//^[a-zA-Z0-9]+$
exports.changePassword = async (req, res, next) => {
  let { ...args } = req.body;
  try {
    if (args.password == "") {
      const error = new Error("passwords can't be empty");
      error.statusCode = 401;
      throw error;
    }
    if (!args.email) {
      email = loadedUser.email;
    }
    if (args.email && args.password) {
      const user = await userModel.findOneAndUpdate(
        {
          email: email
        },
        {
          args
        }
      )
      console.log(user)
      res.status(200).json({
        message: "Changed password"
      })
    }
    
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

exports.getAllUserData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = [];
    const user = await userModel.findOne({ _id: id })
    const posts = await newspostModel.find({ 'author': id })
    const reviews = await reviewModel.find({ 'author.id': id })

    userData.push(user)
    userData.push(posts)
    userData.push(reviews)
    res.status(200).json({
      message: "Acquired all user data",
      data: userData
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
exports.deleteAllUserData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.deleteOne({ _id: id });
    const posts = await newspostModel.deleteMany({ 'author.id': id })
    const reviews = await reviewModel.deleteMany({ 'author.id': id })

    res.status(200).json({
      message: "Sucessfully deleted all user data"
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
exports.changePerms = async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
  const { permissions, user } = req.body
  const { password, role } = user;
  try {
    // CHANGE. DOES NOT WORK. FIND FIGS
    const user = await userModel.findOneAndUpdate(
      {
        _id: id,
        password: password
      },
      {
        role: {
          name: role.name,
          icon: role.icon,
          color: role.color,
          permissions: permissions
        }
      }
    )
    if (!user) {
      const error = new Error("user not found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Changed permissions"
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

exports.newRole = async (req, res, next) => {
  try {
    const { name, icon, color, permissions } = req.body;
    console.log(req.body)
    const role = new roleModel({
      name: name,
      icon: icon,
      color: color,
      permissions: permissions
    });
    const result = await role.save();
    res.status(200).json({
      message: "Successfully created role",
      role: result
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getRole = async (req, res, next) => {
  const { role } = req.params;
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
  const roles = await roleModel.find();
  res.status(200).json({
    roles: roles
  });
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


exports.getUserId = async (req, res, next) => {
  console.log(req)
  const { id } = req.params;
  try {
    if (!id) {
      const error = new Error(`invalid UID +  ${req.params}`);
      error.statusCode = 404;
      throw error;
    }
    console.log(id)
    var o_id = new ObjectId(id);
    let user = await userModel.find({ _id: o_id });
    const userrole = await roleModel.find({ _id: user[0].role })
    user.role = userrole;
    console.log(user)
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      user: user[0]
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    if (loadedUser) {
      let role = await roleModel.find({ _id: loadedUser.role })
      role = role[0]
      res.status(200).json({
        user: {
          id: loadedUser._id,
          name: loadedUser.name,
          email: loadedUser.email,
          role,
          profileimg: loadedUser.profileimg
        },
      });
    } else {
      const error = new Error("invalid uid");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};



exports.getAllUsers = async (req, res, next) => {
  console.log('GET ALL USERS')
  let users2 = await userModel.find();
  let roles = await roleModel.find();
  let users = users2;
  for(let i = 0; i < users.length; i++) {
    for (let r = 0; r < roles.length; r++) {
      console.log(roles[r].id === users[i].role)
      if (roles[r].id === users[i].role) {
        users[i].role = roles[r];
        console.log(users[i].role)
      }
    }
  }
  
  setTimeout(() => {
    //console.log(users)
    res.status(200).json({
      users
    });
  }, 1000)
  
};


