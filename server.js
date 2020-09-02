const express = require('express');
const helmet = require('helmet');
const server = express();
const db = require('./users/userDb');
const userRouter = require('./users/userRouter');


//global Middleware
server.use(express.json());
server.use(helmet());
server.use(logger());
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});


//custom middleware
function logger() {
  return (req, res, next) => {
      console.log(`a ${req.method} request was made to ${req.url}`);

      next();
  };
}
module.exports = server;
