// успешный запрос
const SUCCESS__REQUEST = 200;
// успешно создан
const SUCCESS_CREATE__REQUEST = 200;
// переданы некорректные данные карточки, пользователя, обновления аватара или профиля;

const regex = /https?:\/\/(www\.)?[a-z0-9-]+\.[a-z0-9-.,;_:/?!%@$&#[\]()+-=]+/i;

module.exports = {
  SUCCESS__REQUEST,
  SUCCESS_CREATE__REQUEST,
  regex,
};
