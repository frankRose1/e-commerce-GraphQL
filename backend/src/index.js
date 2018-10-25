//Start the node server
require('dotenv').config({path: 'variables.env'});
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token){
    const {userId} = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

//Put the logged in user on the request
server.express.use( async (req, res, next) => {
  if (!req.userId) {
    return next();
  }
  const user = await db.query.user({
    where: {id: req.userId}
  }, `{email id permissions name}`);
  req.user = user;
  next();
})

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
}, info => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
