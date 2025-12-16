const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

/* =====================================================
   CREATE OR GET CONVERSATION
===================================================== */
exports.createOrGetConversation = async (req, res) => {
  try {
    const { senderId, receiverId, contextType, contextId } = req.body;

    /* ---------- BASIC VALIDATION ---------- */
    if (!senderId || !receiverId || !contextType || !contextId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    /* ---------- PREVENT SELF CHAT ---------- */
    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "Cannot chat with yourself"
      });
    }

    /* ---------- OBJECT ID VALIDATION ---------- */
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId) ||
      !mongoose.Types.ObjectId.isValid(contextId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    /* ---------- FIND EXISTING CONVERSATION ---------- */
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      contextType,
      contextId
    });

    /* ---------- CREATE IF NOT EXISTS ---------- */
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        contextType,
        contextId
      });
    }

    /* ---------- RESPONSE ---------- */
    res.json({
      success: true,
      conversation
    });

  } catch (error) {
    console.error("CREATE CONVERSATION ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =====================================================
   SEND MESSAGE
===================================================== */
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, text } = req.body;

    if (!conversationId || !senderId || !receiverId || !text) {
      return res.status(400).json({
        success: false,
        message: "Missing message fields"
      });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      receiverId,
      text
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageAt: new Date()
    });

    res.json({
      success: true,
      message
    });

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =====================================================
   GET USER CONVERSATIONS
===================================================== */
exports.getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate("participants", "name profilePhoto profession")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      conversations
    });

  } catch (error) {
    console.error("GET CONVERSATIONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =====================================================
   GET MESSAGES FOR A CONVERSATION
===================================================== */
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID"
      });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
