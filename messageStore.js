// const messageSchema = require('./models/messageModel');
// /* abstract */ class MessageStore {
//     saveMessage(message) {}
//     findMessagesForUser(userID) {}
//   }
  
//   class InMemoryMessageStore extends MessageStore {
//     constructor() {
//       super();
//       this.messages = [];
//     }
  
//     saveMessage(message) {
//       this.messages.push(message);
//     }
  
//     findMessagesForUser(userID) {
//       return this.messages.filter(
//         ({ from, to }) => from === userID || to === userID
//       );
//     }
//   }
  
//   const CONVERSATION_TTL = 24 * 60 * 60;
  
//   class MongoMessageStore extends MessageStore {
//     constructor(mongoClient) {
//       super();
//       this.mongoClient = mongoClient;
//     }
  
//     saveMessage(message) {
//       console.log('savemessage', message)
//       const value = JSON.stringify(message);
//       new messageSchema({
//         from: userID,
//         to: message.to,
//         content: value
//       }).exec().save()
//     }
  
//     findMessagesForUser(userID) {
//       console.log('find messages for user', userID)
//       return messageSchema.find({
//           from: userID
//       }).then(res => {
//           console.log('res', res)
//           return res.map((result) => JSON.parse(result));
//       })
//       // return this.redisClient
//       //   .lrange(`messages:${userID}`, 0, -1)
//       //   .then((results) => {
//       //     return results.map((result) => JSON.parse(result));
//       //   });
//     }
//   }
  
//   module.exports = {
//     InMemoryMessageStore,
//     MongoMessageStore,
//   };
  
/* abstract */ class MessageStore {
  saveMessage(message) {}
  findMessagesForUser(userID) {}
}

class InMemoryMessageStore extends MessageStore {
  constructor() {
    super();
    this.messages = [];
  }

  saveMessage(message) {
    this.messages.push(message);
  }

  findMessagesForUser(userID) {
    return this.messages.filter(
      ({ from, to }) => from === userID || to === userID
    );
  }
}

const CONVERSATION_TTL = 24 * 60 * 60;

class RedisMessageStore extends MessageStore {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }

  saveMessage(message) {
    const value = JSON.stringify(message);
    this.redisClient
      .multi()
      .rpush(`messages:${message.from}`, value)
      .rpush(`messages:${message.to}`, value)
      .expire(`messages:${message.from}`, CONVERSATION_TTL)
      .expire(`messages:${message.to}`, CONVERSATION_TTL)
      .exec();
  }

  async findMessagesForUser(userID) {
    console.log("findmessagesforuser", await this.redisClient
      .lrange(`messages:${userID}`, 0, -1)
      .then((results) => {
        return results.map((result) => JSON.parse(result));
      }))
    return this.redisClient
      .lrange(`messages:${userID}`, 0, -1)
      .then((results) => {
        return results.map((result) => JSON.parse(result));
      });
  }
}

module.exports = {
  InMemoryMessageStore,
  RedisMessageStore,
};
