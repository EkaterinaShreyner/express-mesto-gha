const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { ERROR_NOT_FOUND } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// временное решение авторизации
// app.use((req, _res, next) => {
//   req.user = {
//     _id: '64abf03ffd433ccf1d0afe5a', // _id созданного пользователя Кусто
//   };

//   next();
// });

// объединение пакетов данных
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// роуты не требующие авторизации
// роут регистрации
app.post('/signup', createUser);
// роут на авторизацию
app.post('/signin', login);

// авторизация, защита роутов авторизацией
app.use(auth);

// запуск роутера для запросов по строке /users
app.use('/users', usersRouter);
// запуск роутера для запросов по строке /cards
app.use('/cards', cardsRouter);

// роут для несуществующей страницы
app.use('/*', (_req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена' });
});

// обработчики ошибок celebrate
app.use(errors());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Application is running on port ${PORT}`);
});
