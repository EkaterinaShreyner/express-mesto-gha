const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { error_not_found } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

// временное решение авторизации
app.use((req, _res, next) => {
  req.user = {
    _id: '64abf03ffd433ccf1d0afe5a' //_id созданного пользователя Кусто
  };

  next();
});

// объединение пакетов данных
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// запуск роутера для запросов по строке /users
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('/*', (_req, res) => {
  res.status(error_not_found).send({ message: 'Страница не найдена'});
})
// запуск роутера для запросов по строке /cards




app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});