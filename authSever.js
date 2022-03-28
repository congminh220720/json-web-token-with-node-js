const express = require("express");
const jwt = require("jsonwebtoken");
const dotevnt = require("dotenv");

dotevnt.config();

const app = express();
const PORT = 5500;

app.use(express.json());

let refreshTokens = [];

app.post('/refreshToken', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFESH_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: data.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '30s',
      }
    );
    res.json({ accessToken });
  });
});

app.post('/login', (req, res) => {
  // { username: 'Test' }
  const data = req.body;
  console.log({ data });
  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30s',
  });
  const refreshToken = jwt.sign(data, process.env.REFESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

app.post('/logout', (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((refToken) => refToken !== refreshToken);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});