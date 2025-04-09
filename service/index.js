const express = require("express");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const cookieParser = require("cookie-parser");
const app = express();
const DB = require("./database.js");
const websocketServer = require("./websocket.js");
const initWebSocketServer = require("./websocket.js");

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

async function createUser(username, password) {
  console.log("createUser: Creating user `"+username+"` with password `"+password+"`");
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = {
    username: username,
    passwordHash: passwordHash,
    articles: [], // list of article IDs
    id: uuid.v4(),
    auth: null,
  };
  DB.addUser(user);
  return user;
}

async function createAuth(res, user) {
  console.log("createAuth: logging in `"+ user.username + "`");
  const auth = uuid.v4();
  DB.setUserAuth(user.id, auth);
  res.cookie('auth', auth, {
    //secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// registration
app.post("/api/auth", async (req, res) => {
  console.log("registration: Recieved registration request: " + req.body.username);
  if (await DB.getUserByUsername(req.body.username)) {
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
  const user = await DB.getUserByUsername(req.body.username);
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
  await createAuth(res, user);
  res.send({ username: user.username });
});

// logout
app.delete("/api/auth", async (req, res) => {
  const auth = req.cookies['auth'];
  const user = await DB.getUserByAuth(auth);
  if (user) {
    console.log("logout: Logging out `"+user.username+"`");
    await DB.deleteUserAuth(user.id);
    res.clearCookie('auth', { path: '/' });
  } else {
    console.log("logout: user not found, ignoring request")
  }
  res.send({});
});

// getMe
app.get("/api/user", async (req, res) => {
  console.log("getMe: Checking user");
  const auth = req.cookies['auth'];
  if (!auth) {
    console.log("getMe: No auth cookie found");
    res.status(401).send({ msg: "Unauthorized" });
    return;
  }
  const user = await DB.getUserByAuth(auth);
  if (user) {
    console.log("getMe: User found: " + user.username);
    res.send({ username: user.username });
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// get articles
app.get("/api/articles", async (req, res) => {
  const auth = req.cookies['auth'];
  const user = await DB.getUserByAuth(auth);
  
  if (user) {
    console.log("get articles: Recieved request for articles for user "+ user.username);
    articles = await DB.getArticlesByUserId(user.id);
    res.send(articles);
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// add article
app.post("/api/articles", async (req, res) => {
  const auth = req.cookies['auth'];
  const user = await DB.getUserByAuth(auth);
  const article = {
    id: uuid.v4(),
    content: req.body.content,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    tags: req.body.tags,
    title: req.body.title,
    userId: user.id,
  };
  console.log("add article: Recieved request to add article: " + article.title);
  
  if (user) {
    DB.addArticle(article);
    res.send({ msg: "Article added" });
  } else {
    console.log("add article: User not found, ignoring request");
    res.status(401).send({ msg: "Unauthorized" });
  }
});

// delete article
app.delete("/api/articles/:id", async (req, res) => {
  const articleId = req.params.id;
  console.log("delete article: Recieved request to delete article: " + articleId);
  const auth = req.cookies['auth'];
  const user = await DB.getUserByAuth(auth);

  // Check if user is logged in
  if (!auth || !user || user.auth != auth) {
    console.log("delete article: User not logged in, ignoring request");
    res.status(401).send({ msg: "Unauthorized" });
    return;
  }

  // Check if article exists for user
  const article = await DB.getArticleById(articleId);

  if (!article || article.userId !== user.id) {
    console.log("delete article: Article not found, ignoring request");
    res.status(404).send({ msg: "Article not found" });
    return;
  }

  await DB.deleteArticle(articleId);
  res.send({ msg: "Article deleted" });
});

// add comment to article
app.post("/api/comments/:id", async (req, res) => {
  const articleId = req.params.id;
  const {text} = req.body;
  console.log("add comment: Recieved request to add comment to article: " + articleId);
  const filteredText = await filterProfanity(text);
  const auth = req.cookies['auth'];
  const user = await DB.getUserByAuth(auth);
  const comment = {
    id: uuid.v4(),
    text: filteredText,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    userId: user.id,
    username: user.username,
    articleId: articleId,
  };
  
  DB.addComment(comment);
  //TODO: update user
});

// get comments
app.get("/api/comments/:articleId", async (req, res) => {
  const articleId = req.params.articleId;
  console.log("get comments: Recieved request for comments on article: " + articleId);
  const article = await DB.getArticleById(articleId);
  if (!article) {
    console.log("get comments: Article not found");
    res.status(404).send({ msg: "Article not found" });
    return;
  }
  const comments = await DB.getCommentByArticleId(articleId);
  if (!comments) {
    res.send([]);
    return;
  }
  res.send(comments);
});

async function filterProfanity(text) {
  try {
    const encodedText = encodeURIComponent(text);
    const response = await fetch(
      `https://www.purgomalum.com/service/json?text=${encodedText}`
    );
    
    if (!response.ok) {
      console.error("PurgoMalum API error:", response.status);
      return text; // Return original text if API fails
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error filtering profanity:", error);
    return text; // Fallback to original text
  }
}

// Update article
app.put("/api/articles/:id", async (req, res) => {
  const articleId = req.params.id;
  console.log("update article: Received request to update article:", articleId);
  
  const auth = req.cookies['auth'];
  const user = await getUser("auth", auth);
  
  if (user) {
      DB.setArticle(articleId, req.body);
      
      res.send({ msg: "Article updated" });
  } else {
    console.log("update article: User not found, ignoring request");
    res.status(401).send({ msg: "Unauthorized" });
  }
});

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
initWebSocketServer(httpService);