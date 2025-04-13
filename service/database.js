const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const articleCollection = db.collection('article');
const commentCollection = db.collection('comment');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    try {
        await db.command({ ping: 1 });
        console.log(`Connect to database`);
    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);
    }
})();

function addUser(user) {
    return userCollection.insertOne(user);
}
function addArticle(article) {
    return articleCollection.insertOne(article);
}
function addComment(comment) {
    return commentCollection.insertOne(comment);
}

// getUserByAuth is removed - we'll use JWT tokens directly

async function getUserById(userId) {
    return userCollection.findOne({ id: userId });
}

async function getUserByUsername(username) {
    return userCollection.findOne({ username: username });
}

async function getArticleById(id) {
    return articleCollection.findOne({
        id: id,
    });
}
async function getArticlesByUserId(userId) {
    return articleCollection.find({ userId: userId }).toArray();
}

async function getCommentByArticleId(articleId) {
    return commentCollection.find({ articleId: articleId })
        .sort({ _id: -1 }) // flipped around so newest comments are first
        .toArray();
}

function setUser(userId, user) {
    return userCollection.updateOne(
        {
            id: userId,
        },
        {
            $set: user,
        }
    );
}

async function setUserAuth(userId, auth) {
    return await userCollection.updateOne(
        {
            id: userId,
        },
        {
            $set: { auth: auth },
        }
    );
}
async function setArticle(articleId, article) {
    return articleCollection.updateOne(
        {
            id: articleId,
        },
        {
            $set: article,
        }
    );
}

function deleteUser(userId) {
    return userCollection.deleteOne({ id: userId });
}
async function deleteUserAuth(userId) {
    return userCollection.updateOne(
        { id: userId, },
        { $unset: { auth: "" } }
    );
}
async function deleteArticle(articleId) {
    return articleCollection.deleteOne({ id: articleId });
}

async function getArticlesByUserIdAndTags(userId, viewerTags) {
    const articles = await articleCollection.find({
        userId: userId,
        tags: { $elemMatch: { $in: [...viewerTags, "public"] } },
    }).toArray();

    return articles;
}

async function getTagsByUserIdAndViewerId(userId, viewerId) {
    const user = await userCollection.findOne({ id: userId });
    let viewer = await userCollection.findOne({ id: viewerId });
    if (!user || !user.relationships) {
        return [];
    }
    if (!viewer || !viewer.relationships) {
        viewer = { relationships: [], username: "anonymous_user" };
    }

    const relationship = user.relationships.find(rel => rel.username === viewer.username);
    const tags = relationship ? relationship.tags : [];
    return Array.isArray(tags) ? tags : [tags];
}
module.exports = {
    addUser,
    addArticle,
    addComment,
    getUserById,
    getUserByUsername,
    getArticleById,
    getArticlesByUserId,
    getCommentByArticleId,
    setUser,
    setUserAuth,
    setArticle,
    deleteUser,
    deleteUserAuth,
    deleteArticle,
    getArticlesByUserIdAndTags,
    getTagsByUserIdAndViewerId
};