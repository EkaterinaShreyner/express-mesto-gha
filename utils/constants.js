// успешный запрос
const SUCCESS__REQUEST = 200;
// успешно создан
const SUCCESS_CREATE__REQUEST = 200;
// переданы некорректные данные карточки, пользователя, обновления аватара или профиля;
const ERROR_REQUEST = 400;
// карточка или пользователь не найден или был запрошен несуществующий роут;
const ERROR_NOT_FOUND = 404;
// ошибка по умолчанию
const ERROR_SERVER = 500;

module.exports = {
  SUCCESS__REQUEST,
  SUCCESS_CREATE__REQUEST,
  ERROR_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
};
