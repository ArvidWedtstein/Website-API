// const messageSchema = require('./models/messageModel');
// const sessionSchema = require('./models/sessionModel');
// /* abstract */ class SessionStore {
//   findSession(id) {}
//   saveSession(id, session) {}
//   findAllSessions() {}
// }

// class InMemorySessionStore extends SessionStore {
//   constructor() {
//     super();
//     this.sessions = new Map();
//   }

//   findSession(id) {
//     return this.sessions.get(id);
//   }

//   saveSession(id, session) {
//     this.sessions.set(id, session);
//   }

//   findAllSessions() {
//     return [...this.sessions.values()];
//   }
// }

// const SESSION_TTL = 24 * 60 * 60;
// const mapSession = ([userID, username, connected]) =>
//   userID ? { userID, username, connected: connected === "true" } : undefined;

// class MongoSessionStore extends SessionStore {
//   constructor(mongoClient) {
//     super();
//     this.mongoClient = mongoClient;
//   }

//   findSession(id) {
    
//     let session = sessionSchema.findOne({ id: id })
//     console.log('findsession', id)
//     if (!session) return;
//     return mapSession(session)
//     // return this.redisClient
//     //   .hmget(`session:${id}`, "userID", "username", "connected")
//     //   .then(mapSession);
//   }

//   saveSession(id, { userID, username, connected }) {
//     console.log('save session', id, userID, username, connected)
//     new sessionSchema({
//       id,
//       userID,
//       username,
//       connected
//     }).save()
//   }

//   async findAllSessions() {
//     const keys = new Set();
//     let nextIndex = 0;



//     do {
      
//       const sessions = await sessionSchema.find({}, {}, {
//         skip: nextIndex,
//         limit: 100
//       });
//       nextIndex = nextIndex + 1
//       sessions.forEach((session) => keys.add(session.id));
//     } while (nextIndex !== 0);

//     const commands = [];
//     keys.forEach((key) => {
//       commands.push(["hmget", key, "userID", "username", "connected"]);
//     });

//     console.log(keys)
//     return {
//       sessions: sessionSchema.find()
//     }
//     // do {
//     //   const [nextIndexAsStr, results] = await this.redisClient.scan(
//     //     nextIndex,
//     //     "MATCH",
//     //     "session:*",
//     //     "COUNT",
//     //     "100"
//     //   );
//     //   nextIndex = parseInt(nextIndexAsStr, 10);
//     //   results.forEach((s) => keys.add(s));
//     // } while (nextIndex !== 0);
//     // const commands = [];
//     // keys.forEach((key) => {
//     //   commands.push(["hmget", key, "userID", "username", "connected"]);
//     // });
//     // return this.redisClient
//     //   .multi(commands)
//     //   .exec()
//     //   .then((results) => {
//     //     return results
//     //       .map(([err, session]) => (err ? undefined : mapSession(session)))
//     //       .filter((v) => !!v);
//     //   });
//   }
// }
// module.exports = {
//   InMemorySessionStore,
//   MongoSessionStore,
// };
/* abstract */ class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

const SESSION_TTL = 24 * 60 * 60;
const mapSession = ([userID, username, connected]) =>
  userID ? { userID, username, connected: connected === "true" } : undefined;

class RedisSessionStore extends SessionStore {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }

  findSession(id) {
    return this.redisClient
      .hmget(`session:${id}`, "userID", "username", "connected")
      .then(mapSession);
  }

  saveSession(id, { userID, username, connected }) {
    this.redisClient
      .multi()
      .hset(
        `session:${id}`,
        "userID",
        userID,
        "username",
        username,
        "connected",
        connected
      )
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }

  async findAllSessions() {
    const keys = new Set();
    let nextIndex = 0;
    do {
      const [nextIndexAsStr, results] = await this.redisClient.scan(
        nextIndex,
        "MATCH",
        "session:*",
        "COUNT",
        "100"
      );
      nextIndex = parseInt(nextIndexAsStr, 10);
      results.forEach((s) => keys.add(s));
    } while (nextIndex !== 0);
    const commands = [];
    keys.forEach((key) => {
      commands.push(["hmget", key, "userID", "username", "connected"]);
    });
    return this.redisClient
      .multi(commands)
      .exec()
      .then((results) => {
        return results
          .map(([err, session]) => (err ? undefined : mapSession(session)))
          .filter((v) => !!v);
      });
  }
}
module.exports = {
  InMemorySessionStore,
  RedisSessionStore,
};
