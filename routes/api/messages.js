const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Chat = require('../../schemas/ChatSchema');
const Message = require('../../schemas/MessageSchema');

router.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req, res, next) => {
    if (!req.body.content || !req.body.chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    const newMessage = {
        sender: req.session.user._id,
        content: req.body.content,
        chat: req.body.chatId
    };

    try {
        // Create a new message
        let message = await Message.create(newMessage);

        // Populate 'sender' and 'chat' fields
        message = await Message.findById(message._id)
            .populate("sender")
            .populate("chat")
            .exec();

        // Update the latest message in the chat
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.status(201).send(message);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

module.exports = router;
