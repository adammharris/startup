const express = require("express");
const DB = require("../database.js");
const { requireAuth } = require("../utils/authUtils");
const router = express.Router();

// Get current user info - use requireAuth middleware
router.get("/", requireAuth, (req, res) => {
  console.log("getUser: User found: " + req.user.username);
  res.send({ username: req.user.username });
});

// Update relationship (add tag) - use requireAuth middleware
router.put("/relationships", requireAuth, async (req, res) => {
  const user = req.user;
  const { tag, username } = req.body;

  // Add tag to user in relationships (make sure relationships is an array)
  const existingRelationship = (Array.isArray(user.relationships) ? user.relationships : []).find(rel => rel.username === username);
  if (existingRelationship) {
    if (!existingRelationship.tags.includes(tag)) {
      console.log("update relationships: Adding tag to existing relationship");
      existingRelationship.tags.push(tag);
    } else {
      console.log("update relationships: Ignoring request to add tag to existing relationship");
    }
  } else if (user.username === username) {
    console.log("update relationships: Ignoring request to add tag to self");
    return res.status(400).send({ msg: "Cannot add tag to self" });
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

// Get relationships - use requireAuth middleware
router.get("/relationships", requireAuth, async (req, res) => {
  const user = req.user;
  console.log("get relationships: Received request for user relationships");
  res.send(user.relationships);
});

// Delete relationship - use requireAuth middleware
router.delete("/relationships", requireAuth, async (req, res) => {
  const user = req.user;
  const { username } = req.body;
  
  console.log("delete relationships: Received request to delete relationship with user: " + username);
  user.relationships = user.relationships.filter(rel => rel.username !== username);
  DB.setUser(user.id, user);
  res.send({ msg: "Relationship deleted" });
});

// Delete a single tag from a relationship - use requireAuth middleware
router.delete("/relationships/:tag", requireAuth, async (req, res) => {
  const user = req.user;
  const tag = req.params.tag;
  
  console.log("delete relationships: Received request to delete tag: " + tag);
  user.relationships.forEach(rel => {
    rel.tags = rel.tags.filter(t => t !== tag);
  });
  DB.setUser(user.id, user);
  res.send({ msg: "Tag deleted" });
});

module.exports = router;