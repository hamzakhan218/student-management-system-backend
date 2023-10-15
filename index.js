const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors")());

app.listen(9000, async () => {
//   await connectToDB();
  console.log(`Listening to port ${9000}`);
});