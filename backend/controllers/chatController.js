const Conversation = require("../models/Conversation");
const Message = require("../models/Message");





/**
 * Create or fetch existing conversation
 */
exports.createOrGetConversation = async (req, res) => {
  try {
    const { senderId, receiverId, contextType, contextId } = req.body;

    if (!senderId || !receiverId || !contextType || !contextId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      contextType,
      contextId
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        contextType,
        contextId
      });
    }

    res.json({
      success: true,
      conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};





/**
 * Send a message
 */
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




/**
 * Get all conversations for a user
 */
exports.getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate("participants", "name role profileImage")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get messages for a conversation
 */
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

