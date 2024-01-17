import mongoose from 'mongoose';

// Создаем схему по которой будут типа валидироваться данные регистрации пользователя
// Если мы хотим чтобы свойство было обязательным, то делам его объектом с required: true,
// если необязательным, то можно просто (название: тип данных)
const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            // required: true,
        },
        text: {
            type: String,
            // required: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        comments: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        imageUrl: String,
    },
    {
        timestamps: true,
    }
);
// {timestamps: true} обозначает чтобы схема понимала и записывала дату создания и изменения данных

export default mongoose.model('Post', postSchema);

// Мы будем делать MVC (Model, View, Controller), сейчас мы сделали Model
