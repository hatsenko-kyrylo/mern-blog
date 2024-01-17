import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export const addComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const user = await UserModel.findById(req.userId);

        const newComment = {
            text: req.body.text,
            user: {
                userId: user._id,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl,
            },
        };

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                $push: { comments: newComment },
            }
        );
        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to update article',
        });
    }
};

export const getLastComments = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .limit(8)
            .sort({ 'comments.createdAt': -1 })
            .exec();

        const comments = posts
            .map((obj) => obj.comments)
            .flat()
            .slice(0, 8);
        res.json(comments);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get all comments',
        });
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get all tags',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        //Получаем массив всех постов и информацией про автора каждого поста (Но только его имя и аватар)
        const posts = await PostModel.find()
            .populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
            .exec();
        res.json(posts);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get all article',
        });
    }
};
export const getOne = async (req, res) => {
    try {
        const postId = req.params.postId;
        // Мы получаем статью и обновляем ее счетчик просмотров,
        // если надо было просто получать статью, то можно было использовать просто .findOne or .findById
        const updatedPost = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                new: true,
            }
        ).populate('user');
        res.json(updatedPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to get article',
        });
    }
};
export const remove = async (req, res) => {
    try {
        const postId = req.params.postId;

        await PostModel.findOneAndDelete({
            _id: postId,
        });
        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to remove article',
        });
    }
};
export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(','),
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create article',
        });
    }
};
export const update = async (req, res) => {
    try {
        const postId = req.params.postId;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags.split(','),
                imageUrl: req.body.imageUrl,
                user: req.userId,
            }
        );
        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to update article',
        });
    }
};
