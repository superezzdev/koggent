import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("userId", userId);

    const conversation = await Conversation.create({
      userId: userId,
    });

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({
      message: `create conversation error ${error}`,
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("userId", userId);

    const conversations = await Conversation.find({
      userId: userId,
    }).sort({ updatedAt: -1 });

    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({
      message: `get conversation error ${error}`,
    });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const targetId = req.body.id || req.body.conversationId;
    const { title } = req.body;

    if (!targetId || !mongoose.Types.ObjectId.isValid(targetId)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing conversation ID" });
    }

    const conversation = await Conversation.findByIdAndUpdate(
      targetId,
      { title },
      { new: true }
    );

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({
      message: `update conversation error ${error}`,
    });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content, images, artifacts } = req.body;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing conversation ID" });
    }

    const message = await Message.create({
      conversationId,
      content,
      role,
      images: images || [],
      artifacts: artifacts || [],
    });

    try {
      await Conversation.findByIdAndUpdate(conversationId, {
        updatedAt: new Date(),
      });
    } catch (updateErr) {
      console.warn("Notice: Failed to bump conversation updatedAt:", updateErr.message);
    }

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({
      message: `save message error ${error}`,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    if (
      !req.params.conversationId ||
      !mongoose.Types.ObjectId.isValid(req.params.conversationId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or missing conversation ID" });
    }

    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({
      message: `get messages error ${error}`,
    });
  }
};