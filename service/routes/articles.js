const express = require("express");
const uuid = require("uuid");
const DB = require("../database.js");
const { verifyTokenAndGetUser, requireAuth } = require("../utils/authUtils");
const router = express.Router();

// get articles
router.get("/:username", async (req, res) => {
  const token = req.cookies['access'];
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
  if (token) {
    const potential_viewer = await verifyTokenAndGetUser(token);
    if (potential_viewer) {
      viewer.id = potential_viewer.id;
      viewer.tags = potential_viewer.tags;
    }
  }
  
  // Check if viewer is viewing their own or someone else's profile
  if (viewer.id == user.id) {
    console.log("get articles: Received request for own articles");
    const articles = await DB.getArticlesByUserId(user.id);
    res.send(articles);
  } else {
    console.log("get articles: Received request for public articles of user `"+user.username+"`");

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

// add article - use requireAuth middleware
router.post("/", requireAuth, async (req, res) => {
  const user = req.user;
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
  console.log("add article: Received request to add article: " + article.title);
  
  DB.addArticle(article);
  res.send({ msg: "Article added" });
});

// delete article - use requireAuth middleware
router.delete("/:id", requireAuth, async (req, res) => {
  const articleId = req.params.id;
  const user = req.user;
  console.log("delete article: Received request to delete article: " + articleId);

  // Check if article exists for user
  const article = await DB.getArticleById(articleId);

  if (!article || article.userId !== user.id) {
    console.log("delete article: Article not found or does not belong to user, ignoring request");
    res.status(404).send({ msg: "Article not found" });
    return;
  }

  await DB.deleteArticle(articleId);
  res.send({ msg: "Article deleted" });
});

// Update article - use requireAuth middleware
router.put("/:id", requireAuth, async (req, res) => {
  const articleId = req.params.id;
  const user = req.user;
  console.log("update article: Received request to update article:", articleId, req.body);
  
  // Check if article exists and belongs to user
  const article = await DB.getArticleById(articleId);
  if (!article || article.userId !== user.id) {
    console.log("update article: Article not found or does not belong to user");
    res.status(404).send({ msg: "Article not found or you don't have permission" });
    return;
  }
  
  await DB.setArticle(articleId, req.body);
  res.send({ msg: "Article updated" });
});

module.exports = router;