const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Chat = require('../../schemas/ChatSchema');
const Message = require('../../schemas/MessageSchema');
const Notification = require('../../schemas/NotificationSchema');

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

    Message.create(newMessage)
    .then(async (message) => {
        // Populate sender và chat trong một lần gọi populate
        await message.populate('sender');
        await message.populate('chat');

        // Populate các users trong chat
        await message.populate({ path: 'chat.users' });

        // Cập nhật latestMessage trong Chat
        var chat = await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })
            .catch(error => console.log(error));

        // Thêm thông báo
        insertNotifications(chat, message);

        // Trả về message đã được cập nhật
        res.status(201).send(message);
    })
    .catch((error) => {
        console.error(error);
        res.sendStatus(400);
    })
})

function insertNotifications(chat, message) {
    chat.users.forEach(userId => {
        if (userId.toString() === message.sender._id.toString()) return;

        Notification.insertNotification(userId, message.sender._id, "newMessage", message.chat._id);
    })
}

router.get('/:chatId', async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate('sender');
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages", error);
        res.sendStatus(500);
    }
});

module.exports = router;
