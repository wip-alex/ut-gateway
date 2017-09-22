const path = require('path');
const express = require('express');
const Gun = require('gun');
const levelup = require('levelup');
const leveldown = require('leveldown');
// const mongoDown = require('mongodown');
// var mongojs = require('mongojs');

const cors = require('cors');

const app = express();

const { generateKeys } = require('./workers/encryptions');
const api = require('./api');

// var db = mongojs('mongodb', ['ut']);

require('gun-level');

const port = (process.env.PORT || 9000);
const server = app.listen(port);

// Create a new level instance which saves
// to the `data/` folder.
const levelDB = levelup('data', {
	db: leveldown,
});

// const levelMongoDB = levelup('localhost:27017/usertoken', {
// 	db: mongoDown,
// });

const s3Options = {
    key: process.env.AWS_ACCESS_KEY_ID, // AWS Access Key
    secret: process.env.AWS_SECRET_ACCESS_KEY, // AWS Secret Token
    bucket: process.env.AWS_S3_BUCKET, // The bucket you want to save into
    region: process.env.AWS_S3_BUCKET_REGION // us-east-1, etc
};

const gunOptions = {
    level: levelDB,
    file: false,
//    s3: s3Options,
    web: server
};

// if (process.env.NODE_ENV !== 'development') {
//   const indexPath = path.join(__dirname, 'dist/index.html');
//   app.use(express.static('dist'));
//   app.get('/index.html', function (_, res) {
//     res.sendFile(indexPath);
//   });
// }else{
//  const webpack = require('webpack');
//  const webpackDevMiddleware = require('webpack-dev-middleware');
//  const webpackHotMiddleware = require('webpack-hot-middleware');
//  const config = require('./webpack.config.js');
//  const compiler = webpack(config);
//  app.use(webpackHotMiddleware(compiler));
//  app.use(webpackDevMiddleware(compiler));

// }


const indexPath = path.join(__dirname, 'dist/index.html');

app.use(express.static('dist'));
app.use(cors({credentials: true, origin: true}));
app.use(Gun.serve);

app.get('/index.html', function (_, res) {
  res.sendFile(indexPath);
});

app.get('*', api);

setTimeout( generateKeys, 1000);
Gun(gunOptions);
