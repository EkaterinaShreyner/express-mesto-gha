// успешный запрос
const SUCCESS__REQUEST = 200;
// успешно создан
const SUCCESS_CREATE__REQUEST = 200;
// переданы некорректные данные карточки, пользователя, обновления аватара или профиля;
const ERROR_REQUEST = 400;
// ошибка при авторизации
const ERROR_UNAUTHORIZED = 401;
// карточка или пользователь не найден или был запрошен несуществующий роут;
const ERROR_NOT_FOUND = 404;
// ошибка по умолчанию
const ERROR_SERVER = 500;

const regex = /https?:\/\/\(www\.)?\[a-z0-9\-]+\.\[a-z0-9]\/\[a-z0-9]+\/i;

module.exports = {
  SUCCESS__REQUEST,
  SUCCESS_CREATE__REQUEST,
  ERROR_REQUEST,
  ERROR_UNAUTHORIZED,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  regex,
};
