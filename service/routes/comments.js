const express = require("express");
const uuid = require("uuid");
const DB = require("../database.js");
const { requireAuth } = require("../utils/authUtils");
const { filterProfanity } = require("../utils/profanityFilter");
const router = express.Router();

// add comment to article - use requireAuth middleware
router.post("/:id", requireAuth, async (req, res) => {
  const articleId = req.params.id;
  const {text} = req.body;
  console.log("add comment: Recieved request to add comment to article: " + articleId);
  const filteredText = await filterProfanity(text);
  const user = req.user;
  
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
  res.send({ msg: "Comment added" });
});

// get comments
router.get("/:articleId", async (req, res) => {
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

module.exports = router;