const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
app.use(express.json());

users = [];

async function createUser(username, password) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = {
    username: username,
    passwordHash: passwordHash,
  };

  users.push(user);

  return user;
}

async function getUser(field, value) {
  if (value) {
    return users.find((user) => user[field] === value);
  }
  return null;
}
// registration
app.post("/api/auth", async (req, res) => {
  console.log("tried to register");
  if (await getUser("username", req.body.username)) {
    res.status(409).send({ msg: "Existing user" });
  } else {
    const user = await createUser(req.body.username, req.body.password);
    res.send({ username: user.username });
  }
});

// login
app.put("/api/auth", async (req, res) => {
  console.log("tried to login");
  res.send({ email: "marta@id.com" });
});

// logout
app.delete("/api/auth", async (req, res) => {
  res.send({});
});

// getMe
app.get("/api/user", async (req, res) => {
  res.send({ email: "marta@id.com" });
});

app.listen(3000);
