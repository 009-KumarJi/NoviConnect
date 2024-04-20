import {User} from "../models/user.model.js";
import {Chat} from "../models/chat.model.js";
import {faker, simpleFaker} from "@faker-js/faker";
import {Message} from "../models/message.model.js";

export const createSingleChats = async (chatCount) => {
  try {
    const users = await User.find().select("_id");
    const chatsPromises = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        chatsPromises.push(
          Chat.create({
            name: faker.person.fullName(),
            members: [users[i], users[j]]
          }));
      }
    }
    await Promise.all(chatsPromises);

    console.log(`${chatCount} single chats created successfully!`);
    process.exit();

  } catch (error) {
    console.error(error);
  }
};
export const createGroupChats = async (chatCount) => {
  try {
    const users = await User.find().select("_id");
    console.log(users.length, "users fetched!")
    const chatsPromises = [];
    for (let i = 0; i < chatCount; i++) {
      const numMembers = simpleFaker.number.int({min: 3, max: users.length});
      const members = [];
      for (let j = 0; j < numMembers; j++) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];
        if (!members.includes(randomUser)) members.push(randomUser);
      }
      const chat = await Chat.create({
        groupChat: true,
        name: faker.lorem.words(1),
        members,
        creator: members[0],
      });
      chatsPromises.push(chat);
    }
    console.log(chatsPromises.length, "chats created!")
    console.log(chatsPromises)

    await Promise.all(chatsPromises);

    console.log(`${chatCount} group chats created successfully!`);
    process.exit();

  } catch (error) {
    console.error(error);
  }
};
export const createMessages = async (messageCount) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id");
    const messagesPromises = [];
    for (let i = 0; i < messageCount; i++) {
      const randomChatIndex = Math.floor(Math.random() * chats.length);
      const randomChat = chats[randomChatIndex];
      const randomUserIndex = Math.floor(Math.random() * users.length);
      const randomUser = users[randomUserIndex];
      messagesPromises.push(
        Message.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }
    await Promise.all(messagesPromises);

    console.log(`${messageCount} messages created successfully!`);
    process.exit();

  } catch (error) {
    console.error(error);
  }
};
export const createMessagesInChat = async (chatId, messageCount) => {
  try {
    const users = await User.find().select("_id");
    const messagesPromises = [];
    for (let i = 0; i < messageCount; i++) {
      const randomUserIndex = Math.floor(Math.random() * users.length);
      const randomUser = users[randomUserIndex];
      messagesPromises.push(
        Message.create({
          chat: chatId,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }
    await Promise.all(messagesPromises);

    console.log(`${messageCount} messages created successfully in chat ${chatId}!`);
    process.exit();

  } catch (error) {
    console.error(error);
  }
};