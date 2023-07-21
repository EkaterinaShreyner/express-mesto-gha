const jwt = require('jsonwebtoken'); // для создания токена

// eslint-disable-next-line consistent-return
function auth(req, res, next) {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что token есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Передан неверный JWT' });
  }
  // извлеваем токен, в переменную token запишется только JWT
  const token = authorization.replace('Bearer', '');
  // верифицируем токен, вернёт пейлоуд токена
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return res.status(401).send({ message: 'Неверный токен' });
  }
  // записываем пейлоуд в объект запроса
  req.user = payload;
  // пропускаем запрос дальше
  next();
}

module.exports = auth;
