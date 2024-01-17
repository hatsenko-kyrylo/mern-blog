import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        // Хороший способ хэшировать пароль
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        // Сохраняем пользователя в базе данных
        const user = await doc.save();
        // Зашифруем id, нам хватит ттолько его что узнавать например авторизован ли пользователь и тд.
        // Второе поле это секретный ключ, в третьем expiresIn обозначает сколько времени будет хранится этот токен
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secretHash',
            {
                expiresIn: '30d',
            }
        );

        // Не включаем в ответ passwordHash
        const { passwordHash, ...userData } = user._doc;

        // Только один ответ можно возвращать
        res.json({ ...userData, token }); // Добавил объект
        // res.json(user); - так второй раз тут писать нельзя
    } catch (error) {
        // Консолим для себя
        console.log(error);
        // Это ответ для пользователя
        res.status(500).json({
            message: 'Произошла ошибка при регистрации пользователя',
        });
    }
};
export const login = async (req, res) => {
    try {
        // Проверяем есть ли данная почта в дазе данных
        const user = await UserModel.findOne({ email: req.body.email });

        // Если нужно почты нет, останавливаем кож и оповещаем пользователя
        if (!user) {
            // Если мы пишем реальное приложение, ни в коем случае не сообщай почему пользователю не удалось авторизоваться
            // Лучше написать message: 'Неверный логин или пароль',
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        // Теперь проверяем схожесть пароля
        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        // Если сюда дошел код, значит пользователь смог авторизоваться
        // Повторяем код из запроса регистрации
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secretHash',
            {
                expiresIn: '30d',
            }
        );

        // Мы не создаем пользователя, мы находим уже существующего
        const { passwordHash, ...userData } = user._doc;
        res.json({ ...userData, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Не удалось авторизоваться' });
    }
};
export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: 'Пользователь не найден',
            });
        }
        // Мы не создаем пользователя, мы находим уже существующего
        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
};
