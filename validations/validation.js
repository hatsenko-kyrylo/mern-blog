import { body } from 'express-validator';

// Запись body('email').isEmail() проверяет явлется ли свойство email - эмейлом,
// если да, то оно его пропускает, если нет, то express-validator сообщит нам об этом
export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Пароль должен содержать не менее 6 символов')
        .matches(/\d/)
        .withMessage('Пароль должен содержать хотя бы одну цифру')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Пароль должен содержать хотя бы один специальный символ'),
    body('fullName', 'Укажите имя').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Пароль должен содержать не менее 6 символов')
        .matches(/\d/)
        .withMessage('Пароль должен содержать хотя бы одну цифру')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Пароль должен содержать хотя бы один специальный символ'),
];

export const postCreateValidation = [
    body('title', 'Enter article title').isLength({ min: 3 }).isString(),
    body('text', 'Enter article text').isLength({ min: 10 }).isString(),
    body('tags', 'Incorrwct tag format').optional().isString(),
    body('imageUrl', 'Invalid image link').optional().isString(),
];
