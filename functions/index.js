'use strict';

const functions = require('firebase-functions');
const express = require('express');
const app = express();
const helmet = require('helmet');
const hbs = require('express-handlebars');
const cors = require('cors');
const logger = require('morgan');
const _filter = require('./common/filter');
const _hbsHelper = require('./common/hbsHelper');
const _food = require('./modules/food');


// helmet 적용
app.use(helmet());
app.use(helmet.noCache());

// 핸들바 뷰 엔진 설정
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  helpers: _hbsHelper,
}));
app.set('view engine', 'hbs');

// morgan 적용
app.use(logger());


// CORS 설정
app.use(cors({ origin: true }));

// 라우터 설정
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/food', _food.route.foodView);
app.get('/api/foods/create', _food.route.createDelacourtHistory);


// 400, 500 처리
app.use(_filter.errorPage.notFound);
app.use(_filter.errorPage.serverError);


exports.playground = functions.https.onRequest(app);
// exports.delacourt = functions.region('asia-northeast1').https.onRequest(app);
