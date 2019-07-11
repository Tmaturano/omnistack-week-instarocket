const Post = require('../models/Post');

module.exports = {
    async store(req, res) {
        const post = await Post.findById(req.params.id);

        post.likes += 1;

        await post.save();

        //all connected users will receive a message from socket.io with this new information in real time
        req.io.emit('like', post);

        return res.json(post);
    }
};