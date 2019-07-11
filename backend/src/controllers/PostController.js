const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fileSystem = require('fs');

module.exports = {
    async index(req, res) {
        const posts = await Post.find().sort('-createdAt');  //- = DESC

        return res.json(posts);
    },

    async store(req, res) {
        const { author, place, description, hashtags } = req.body;
        const { filename: image } = req.file;

        const [name] = image.split('.');
        const fileName = `${name}.jpg`;

        //resize the image for 500px
        await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile(
                path.resolve(req.file.destination, 'resized', fileName)
            );

        //store only the resized images and delete from the uploads folder
        fileSystem.unlinkSync(req.file.path);

        const post = await Post.create({
            author,
            place,
            description,
            hashtags,
            image: fileName,
        });

        //all connected users will receive a message from socket.io with this new information in real time
        req.io.emit('post', post);

        return res.json(post);
    }
};