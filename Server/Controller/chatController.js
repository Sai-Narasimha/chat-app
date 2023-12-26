const ChatModel = require("../Models/chatModel");
const { UserModel } = require("../Models/userModel");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) return res.status(200).json(chat);
    const newChat = new ChatModel({ members: [firstId, secondId] });
    const response = await newChat.save();
    res.status(200).json(response);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: error });
  }
};

// find user chat to find all the chat of the persons to display like a whatsapp having in the left

const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await ChatModel.find({ members: { $in: [userId] } });
    res.status(200).json(chats);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: error });
  }
};
// find chat is a chat between you and another person. This is for displaying in the personal chat
const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: error });
  }
};

module.exports = { createChat, findUserChats, findChat };
