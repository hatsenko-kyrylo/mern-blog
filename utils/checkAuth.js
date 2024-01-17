import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  // Проверка для Insomnia
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      // Расшифровка токена
      const decoded = jwt.verify(token, 'secretHash');

      // Переносим в реквест
      req.userId = decoded._id;
      // Запуск следующей функции
      next();
    } catch (e) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};
