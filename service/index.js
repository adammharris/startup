const express = require("express");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const cookieParser = require("cookie-parser");
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express();
const DB = require("./database.js");
const initWebSocketServer = require("./websocket.js");

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(cookieParser());
// Serve frontend static files only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

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
    tags: [], // list of tags
    relationships: []
  };
  DB.addUser(user);
  return user;
}

async function createAuth(res, user) {
  console.log("createAuth: logging in `"+ user.username + "`");
  const auth = uuid.v4();
  DB.setUserAuth(user.id, auth);
  res.cookie('auth', auth, {
    // Set secure: true only if not in development (or if explicitly configured for HTTPS)
    // In production, Caddy handles HTTPS, but the connection between Caddy and Node is HTTP.
    // However, the cookie should still be marked secure if the *client* connection is HTTPS.
    secure: true,
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
app.get("/api/articles/:username", async (req, res) => {
  const auth = req.cookies['auth'];
  const username = req.params.username;

  // Handle case where username is not found in database
  let user = await DB.getUserByUsername(username);
  if (!user) {
    console.log("get articles: User not found");
    res.status(404).send({ msg: "User not found" });
    return;
  }

  // Work whether user is logged in or not
  let viewer = {
    id: -1,
    tags: [],
  };
  if (auth) {
    potential_viewer = await DB.getUserByAuth(auth);
    if (potential_viewer) {
      viewer.id = potential_viewer.id;
      viewer.tags = potential_viewer.tags;
    }
  }
  
  // Check if viewer is viewing their own or someone else's profile
  if (viewer.id == user.id) {
    console.log("get articles: Recieved request for own articles");
    const articles = await DB.getArticlesByUserId(user.id);
    res.send(articles);
  } else {
    console.log("get articles: Recieved request for public articles of user `"+user.username+"`");

    const tags = await DB.getTagsByUserIdAndViewerId(user.id, viewer.id);
    if (!tags) {
      viewer.tags = [];
    } else {
    viewer.tags = tags;
    }
    const articles = await DB.getArticlesByUserIdAndTags(user.id, viewer.tags);
    res.send(articles);
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
  console.log("update article: Received request to update article:", articleId,req.body);
  
  const auth = req.cookies['auth'];
  const user = await DB.getUserByAuth(auth);
  
  if (user) {
      await DB.setArticle(articleId, req.body);
      
      res.send({ msg: "Article updated" });
  } else {
    console.log("update article: User not found, ignoring request");
    res.status(401).send({ msg: "Unauthorized" });
  }
});

app.put("/api/user/relationships", async (req, res) => {
  const auth = req.cookies['auth'];
  const user = await DB.getUserByAuth(auth);
  const { tag, username } = req.body;
  // Add tag to user in relationships
  const existingRelationship = user.relationships.find(rel => rel.username === username);
  if (existingRelationship) {
    if (!existingRelationship.tags.includes(tag)) {
      console.log("update relationships: Adding tag to existing relationship");
      existingRelationship.tags.push(tag);
    }
    console.log("update relationships: Ignoring request to add tag to existing relationship");
  } else if (user.username === username) {
    console.log("update relationships: Ignoring request to add tag to self");
    res.status(400).send({ msg: "Cannot add tag to self" });
  } else {
    console.log("update relationships: Creating new relationship");
    user.relationships.push({
      username: username,
      tags: [tag],
    });
  }
  DB.setUser(user.id, user);
  res.send({ msg: "Relationship updated" });
});

app.get("/api/user/relationships", async (req, res) => {
  const auth = req.cookies['auth'];
  const user = await DB.getUserByAuth(auth);
  if (user) {
    console.log("get relationships: Recieved request for user relationships");
    res.send(user.relationships);
  } else {
    console.log("get relationships: User not found, ignoring request");
    res.status(401).send({ msg: "Unauthorized" });
  }
});

app.delete("/api/user/relationships", async (req, res) => {
  const auth = req.cookies['auth'];
  const user = await DB.getUserByAuth(auth);
  const { username } = req.body;
  if (user) {
    console.log("delete relationships: Recieved request to delete relationship with user: " + username);
    user.relationships = user.relationships.filter(rel => rel.username !== username);
    DB.setUser(user.id, user);
    res.send({ msg: "Relationship deleted" });
  } else {
    console.log("delete relationships: User not found, ignoring request");
    res.status(401).send({ msg: "Unauthorized" });
  }
}
);

// delete a single tag from a relationship
app.delete("/api/user/relationships/:tag", async (req, res) => {
  const auth = req.cookies['auth'];
  const user = await DB.getUserByAuth(auth);
  const tag = req.params.tag;
  if (user) {
    console.log("delete relationships: Recieved request to delete tag: " + tag);
    user.relationships.forEach(rel => {
      rel.tags = rel.tags.filter(t => t !== tag);
    });
    DB.setUser(user.id, user);
    res.send({ msg: "Tag deleted" });
  } else {
    console.log("delete relationships: User not found, ignoring request");
    res.status(401).send({ msg: "Unauthorized" });
  }
}
);

let server;

if (process.env.NODE_ENV === 'production') {
  // --- Create and start the HTTP server for production ---
  server = http.createServer(app).listen(port, () => {
    console.log(`Production service listening on HTTP port ${port}`);
  });
} else {
  // --- Create HTTPS server options for development ---
  const options = {
    key: fs.readFileSync('localhost-key.pem'), // Adjust filename if needed
    cert: fs.readFileSync('localhost.pem')    // Adjust filename if needed
  };
  // --- Create and start the HTTPS server for development ---
  server = https.createServer(options, app).listen(port, () => {
    console.log(`Development service listening on HTTPS port ${port}`);
  });
}

// --- Initialize WebSocket Server with the created server ---
initWebSocketServer(server);