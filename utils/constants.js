// успешный запрос
const success_request = 200;
// успешно создан
const success_create_request = 200;
// переданы некорректные данные в методы создания карточки, пользователя, обновления аватара или профиля;
const error_request = 400;
// карточка или пользователь не найден или был запрошен несуществующий роут;
const error_not_found = 404
// ошибка по умолчанию
const error_server = 500

module.exports = {
  success_request,
  success_create_request,
  error_request,
  error_not_found,
  error_server
}