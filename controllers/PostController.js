import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';
import CommentModel from '../models/Comment.js';

export const addComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const user = await UserModel.findById(req.userId);

        const newComment = new CommentModel({
            text: req.body.text,
            user: user._id,
        });

        const savedComment = await newComment.save();

        await PostModel.findByIdAndUpdate(postId, {
            $push: { comments: savedComment._id },
        });
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
        const allComments = await CommentModel.find()
            .sort({ createdAt: -1 })
            .limit(8)
            .populate({
                path: 'user',
                model: 'User',
                select: 'fullName avatarUrl',
            })
            .exec();

        res.json(allComments);
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

        // Получаем пост и популируем данные пользователя и комментарии
        const post = await PostModel.findById(postId)
            .populate('user', 'fullName avatarUrl')
            .populate({
                path: 'comments',
                options: { sort: { createdAt: 1 } }, // Сортируем комментарии в каждом посте
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'fullName avatarUrl',
                },
            })
            .exec();

        // Увеличиваем счетчик просмотров
        await PostModel.findByIdAndUpdate(
            postId,
            {
                $inc: { viewsCount: 1 },
            },
            {
                new: true,
            }
        );

        res.json(post);
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
