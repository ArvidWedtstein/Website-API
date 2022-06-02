const mongoose = require('mongoose');
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const bodyParser = require("body-parser");
const authfields = require('./graphql/GraphQLAuthRouter');
const newsfields = require('./graphql/GraphQLNewsRouter');
const projectfields = require('./graphql/GraphQLProjectRouter');
var cors = require('cors');
const fs = require("fs");
var helmet = require('helmet');

const {
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql');

require('dotenv').config();

// Routes
const authRouter = require("./routes/authRouter");
const projectRouter = require("./routes/projectRouter");
const newsRouter = require("./routes/newsRouter");

const app = express();



// ----------------------------
// Logger for Requests
// ----------------------------

const getActualRequestDurationInMilliseconds = start => {
  const NS_PER_SEC = 1e9; //  convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};


let Logger = (req, res, next) => { //middleware function
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let method = req.method;
  let url = req.url;
  let status = res.statusCode;
  const start = process.hrtime();
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
  
  let log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString() + "ms"}`;
  console.log(log);
  next();
};


app.use(Logger);


/* GraphQL */
const Schema = new GraphQLSchema({
  description: "Schema",
  query: new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: { ...authfields.get, ...newsfields.get, ...projectfields.get }
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: { ...authfields.mutation, ...newsfields.mutation, ...projectfields.mutation }
  })
})
app.use('/api/graphql', graphqlHTTP({
  schema: Schema,
  graphiql: true
}));

/* REST */
app.use(helmet());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/favicon.ico', express.static('favicon.ico'));

var allowlist = [
  "http://localhost:3000",
  "https://nuxtarvidw.netlify.app", 
]
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

/* Enable CORS */
app.use(cors(corsOptionsDelegate));

app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", 'https://nuxtarvidw.netlify.app')
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  next();
});

/* Auth every request */
//app.use(authenticateMiddleware);

// ----------------------------
// Routers
// ----------------------------
app.use("/api/auth", authRouter);
app.use("/api/project", projectRouter);
app.use("/api/news", newsRouter);

/* Error Handling */ 
app.use((error, req, res, next) => {
  console.error("ERR: ", error.message);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// ----------------------------
// Connect to MongoDB
// ----------------------------
var MONGOOSE_URI = process.env.MONGODB_URL;
if (!MONGOOSE_URI) console.error("404 - MongoDB URI not found.\nCheck .env variables")

const mongoclient = mongoose.connect(MONGOOSE_URI).then(function (result) {
  app.listen(process.env.PORT);
}).catch((err) => { return console.log(err); });
mongoose.Promise = global.Promise;





// ----------------------------
// Initialize Socket.io server
// ----------------------------
// const httpServer = require("http").createServer();
// const { setupWorker } = require("@socket.io/sticky");
// const Redis = require("ioredis");
// const redisClient = new Redis();

// const io = require("socket.io")(httpServer, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
//   adapter: require("socket.io-redis")({
//     pubClient: redisClient,
//     subClient: redisClient.duplicate(),
//   }),
// });


// const crypto = require("crypto");
// const randomId = () => crypto.randomBytes(8).toString("hex");

// const { RedisSessionStore } = require("./sessionStore");
// const sessionStore = new RedisSessionStore(redisClient);

// const { RedisMessageStore } = require("./messageStore");
// const messageStore = new RedisMessageStore(redisClient);

// io.use(async (socket, next) => {
//   const sessionID = socket.handshake.auth.sessionID;
//   if (sessionID) {
//     const session = await sessionStore.findSession(sessionID);
//     if (session) {
//       socket.sessionID = sessionID;
//       socket.userID = session.userID;
//       socket.username = session.username;
//       return next();
//     }
//   }
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   socket.sessionID = randomId();
//   socket.userID = randomId();
//   socket.username = username;
//   next();
// });

// io.on("connection", async (socket) => {
//   // persist session
//   sessionStore.saveSession(socket.sessionID, {
//     userID: socket.userID,
//     username: socket.username,
//     connected: true,
//   });

//   // emit session details
//   socket.emit("session", {
//     sessionID: socket.sessionID,
//     userID: socket.userID,
//   });

//   // join the "userID" room
//   socket.join(socket.userID);

//   // fetch existing users
//   const users = [];

//   const [messages, sessions] = await Promise.all([
//     messageStore.findMessagesForUser(socket.userID),
//     sessionStore.findAllSessions(),
//   ]);
//   const messagesPerUser = new Map();
//   messages.forEach((message) => {
//     const { from, to } = message;
//     const otherUser = socket.userID === from ? to : from;
//     if (messagesPerUser.has(otherUser)) {
//       messagesPerUser.get(otherUser).push(message);
//     } else {
//       messagesPerUser.set(otherUser, [message]);
//     }
//   });

//   sessions.forEach((session) => {
//     users.push({
//       userID: session.userID,
//       username: session.username,
//       connected: session.connected,
//       messages: messagesPerUser.get(session.userID) || [],
//     });
//   });
//   socket.emit("users", users);

//   // notify existing users
//   socket.broadcast.emit("user connected", {
//     userID: socket.userID,
//     username: socket.username,
//     connected: true,
//     messages: [],
//   });

//   // forward the private message to the right recipient (and to other tabs of the sender)
//   socket.on("private message", ({ content, to }) => {
//     const message = {
//       content,
//       from: socket.userID,
//       to,
//     };
//     socket.to(to).to(socket.userID).emit("private message", message);
//     messageStore.saveMessage(message);
//   });

//   // notify users upon disconnection
//   socket.on("disconnect", async () => {
//     const matchingSockets = await io.in(socket.userID).allSockets();
//     const isDisconnected = matchingSockets.size === 0;
//     if (isDisconnected) {
//       // notify other users
//       socket.broadcast.emit("user disconnected", socket.userID);
//       // update the connection status of the session
//       sessionStore.saveSession(socket.sessionID, {
//         userID: socket.userID,
//         username: socket.username,
//         connected: false,
//       });
//     }
//   });
// });

// setupWorker(io);


// const PORT = 42069;

// httpServer.listen(PORT, () =>
//   console.log(`server listening at http://localhost:${PORT}`)
// );



console.log(`API is now (barely) running on localhost:${process.env.PORT}`);
