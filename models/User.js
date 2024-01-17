import mongoose from 'mongoose';

// Создаем схему по которой будут типа валидироваться данные регистрации пользователя
// Если мы хотим чтобы свойство было обязательным, то делам его объектом с required: true,
// если необязательным, то можно просто (название: тип данных)
const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        avatarUrl: String,
    },
    {
        timestamps: true,
    }
);

// {timestamps: true} обозначает чтобы схема понимала и записывала дату создания и изменения данных

export default mongoose.model('User', userSchema);

// Мы будем делать MVC (Model, View, Controller), сейчас мы сделали Model
