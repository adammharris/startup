const express = require("express");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

users = [];

async function createUser(username, password) {
  console.log("createUser: Creating user `"+username+"` with password `"+password+"`");
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = {
    username: username,
    passwordHash: passwordHash,
    articles: [],
  };
  users.push(user);
  return user;
}

async function createAuth(res, user) {
  console.log("createAuth: logging in `"+ user.username + "`");
  user.auth = uuid.v4();
  res.cookie('auth', user.auth, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

async function getUser(field, value) {
  if (value) {
    console.log("getUser: Searching for user with " + field + " = " + value);
    return users.find((user) => user[field] === value);
  }
  return null;
}
// registration
app.post("/api/auth", async (req, res) => {
  console.log("registration: Recieved registration request: " + req.body.username);
  if (await getUser("username", req.body.username)) {
    console.log("registration: Registration rejected because user already exists")
    res.status(409).send({ msg: "Existing user" });
  } else {
    console.log("registration: Registration accepted")
    const user = await createUser(req.body.username, req.body.password);
    createAuth(res, user);
    res.send({ username: user.username });
  }
});

// login
app.put("/api/auth", async (req, res) => {
  const user = await getUser("username", req.body.username);
  console.log("login: Recieved login request: " + req.body.username);
  // Check if user exists
  if (!user) {
    console.log("login: Login rejected because user was not found");
    res.status(401).send({ msg: "Invalid credentials" });
    return;
  }
  // Check if user is already logged in
  if (user.auth) {
    console.log("login: Rejected because user is already logged in");
    res.status(401).send({ msg: "Invalid credentials" });
    return;
  }
  // Check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!validPassword) {
    console.log("login: Login rejected because password was incorrect")
    res.status(401).send({ msg: "Invalid credentials" });
    return;
  }
  console.log("login: Login accepted")
  createAuth(res, user);
  res.send({ username: user.username });
});

// logout
app.delete("/api/auth", async (req, res) => {
  const auth = req.cookies['auth'];
  const user = await getUser("auth", auth);
  if (user) {
    console.log("logout: Logging out `"+user.username+"`");
    delete user.auth;
    res.clearCookie('auth')
  } else {
    console.log("logout: user not found, ignoring request")
  }
  res.send({});
});

// getMe
app.get("/api/user", async (req, res) => {
  console.log("getMe: Checking user");
  const auth = req.cookies['auth'];
  const user = await getUser("auth", auth);
  if (user) {
    console.log("getMe: User found: " + user.username);
    res.send({ username: user.username });
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// get articles
app.get("/api/articles", async (req, res) => {
  console.log("get articles: Recieved request for articles");
  const auth = req.cookies['auth'];
  const user = await getUser("auth", auth);
  if (user) {
    res.send(user.articles);
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// add article
app.post("/api/articles", async (req, res) => {
  const article = {
    id: uuid.v4(),
    content: req.body.content,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    tags: req.body.tags,
    title: req.body.title
  };
  console.log("add article: Recieved request to add article: " + article.title);
  const auth = req.cookies['auth'];
  const user = await getUser("auth", auth);
  if (user) {
    user.articles.push(article);
    res.send({ msg: "Article added" });
  } else {
    console.log("add article: User not found, ignoring request");
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// delete article
app.delete("/api/articles/:title", async (req, res) => {
  const articleTitle = req.params.title;
  console.log("delete article: Recieved request to delete article: " + articleTitle);
  const auth = req.cookies['auth'];
  const user = await getUser("auth", auth);
  if (user) {
    user.articles = user.articles.filter(article => article.title !== articleTitle);
    res.send({ msg: "Article deleted" });
  } else {
    console.log("delete article: User not found, ignoring request");
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// add comment to article
app.post("/api/comments/:title", async (req, res) => {
  const articleTitle = req.params.title;
  const comment = {
    id: uuid.v4(),
    text: req.body.text,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
  console.log("add comment: Recieved request to add comment to article: " + articleTitle);
  const auth = req.cookies['auth'];
  const user = await getUser("auth", auth);
  if (user) {
    const article = user.articles.find(article => article.title === articleTitle);
    if (article) {
      if (!article.comments) {
        article.comments = [];
      }
      comment.username = user.username;
      article.comments.push(comment);
      res.send({ msg: "Comment added" });
    } else {
      console.log("add comment: Article not found, ignoring request");
      res.status(404).send({ msg: "Article not found" });
    }
  } else {
    console.log("add comment: User not found, ignoring request");
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// get comments
app.get("/api/comments/:title", async (req, res) => {
  const articleTitle = req.params.title;
  console.log("get comments: Recieved request for comments on article: " + articleTitle);
  const auth = req.cookies['auth'];
  const user = await getUser("auth", auth);
  if (user) {
    const article = user.articles.find(article => article.title === articleTitle);
    if (article) {
      res.send(article.comments || []);
    } else {
      console.log("get comments: Article not found, ignoring request");
      res.status(404).send({ msg: "Article not found" });
    }
  } else {
    console.log("get comments: User not found, ignoring request");
    res.status(401).send({ msg: "Unauthorized" });
  }
}
);

app.listen(3000);
