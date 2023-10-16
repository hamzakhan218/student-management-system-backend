const express = require("express");
const morgan = require("morgan");
const connectToDB = require("./db/index");
const home = require('./routes/home')
const login = require('./routes/login')
const signup = require('./routes/signup')
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors")());

app.use('/api',home)
app.use('/api',login)
app.use('/api',signup)

app.listen(9000, async () => {
  await connectToDB();
  console.log(`Listening to port ${9000}`);
});