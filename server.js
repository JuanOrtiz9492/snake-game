//how to create a express server?
const path = require("path");
const express = require("express");

const app = express();
const port = 3002;
const staticPath = path.join(__dirname, "/public");
app.use(express.static(staticPath));
app.get("/snakegame", (req, res) => {
  const index = path.join(__dirname, "public", "index.html");
  res.sendFile(index);
});
app.listen(port, function () {
  console.log(`listening on port: ${port}`);
});
