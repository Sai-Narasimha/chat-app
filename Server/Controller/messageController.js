const MessageModel = require("../Models/messageModel");

// create message

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  try {
    const message = new MessageModel({
      chatId,
      senderId,
      text,
    });

    const response = await message.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// get messages

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await MessageModel.find({ chatId });
    console.log("messages: ", messages);
    res.status(200).json(messages);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: error });
  }
};

module.exports = { createMessage, getMessages };
