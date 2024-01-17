import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { UserController, PostController } from './controllers/index.js';
import { checkAuth, handleValidationError } from './utils/index.js';
// Если у нас в package.json указано "type": "module", то при импорте нужно указывать расширение (.js/.ts);
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from './validations/validation.js';

mongoose
    .connect(
        'mongodb+srv://admin:rare-password@blog-mern.z0mq9vy.mongodb.net/blog?retryWrites=true&w=majority'
    )
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB Error', err));

// Мы показали что у нас есть приложение експресс
const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Позволяет экспрессу, а то есть нашему приложению различать JSON формат
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Вторым аргументом приходит наша валидация, и что только если данные которые пришли проходят валидацию,
// то только тогда выполняем колл-бэк функцию
app.post(
    '/auth/register',
    registerValidation,
    handleValidationError,
    UserController.register
);
app.post(
    '/auth/login',
    loginValidation,
    handleValidationError,
    UserController.login
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `uploads/${req.file.originalname}`,
    });
});

app.get('/tags', PostController.getLastTags);
// app.use('/posts')
app.get('/posts', PostController.getAll);
app.get('/posts/:postId', PostController.getOne);
app.delete('/posts/:postId', checkAuth, PostController.remove);
app.patch(
    '/posts/:postId',
    checkAuth,
    postCreateValidation,
    handleValidationError,
    PostController.update
);
app.post(
    '/posts',
    checkAuth,
    postCreateValidation,
    handleValidationError,
    PostController.create
);

app.get('/comments', PostController.getLastComments);
app.patch(
    `/posts/:postId/comment`,
    checkAuth,
    postCreateValidation,
    PostController.addComment
);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});

//
//
//
//
// Примеры из начала урока

// // Если на приложение приходит GET запрос, на главный путь('/'), то я буду делать...
// //req это что клиент прислал мне с фронтенда
// // res - что я буду передавать клиенту
// app.get('/', (req, res) => {
//   // Мы возвращаем ответ пользователю на его GET запрос на '/'
//   res.send('Response');
// });

// app.post('/auth/login', (req, res) => {
//   // Генерируем токен
//   const token = jwt.sign(
//     {
//       email: req.body.email,
//       fullName: 'John Weak',
//     },
//     'secretToken' // Тут можно писать что угодно, это спец. ключ
//   );

//   // Тут мы возвращаем ответ пользователю (в формате json)
//   res.json({
//     success: true,
//     token,
//   });
// });
