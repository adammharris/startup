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
async function getUserByAuth(authToken) {
    return userCollection.findOne({ auth: authToken });
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
async function getArticleByUserTitle(userId, title) {
    return articleCollection.findOne({
        userId: userId,
        title: title,
    });
}
async function getCommentByArticleId(articleId) {
    return commentCollection.find({ articleId: articleId }).toArray();
}

function setUser(userId, user) {
    return userCollection.updateOne(
        {
            _id: userId,
        },
        {
            $set: user,
        }
    );
}
function setArticle(articleId, article) {
    return articleCollection.updateOne(
        {
            _id: articleId,
        },
        {
            $set: article,
        }
    );
}

function deleteUser(userId) {
    return userCollection.deleteOne({ _id: userId });
}
function deleteArticle(articleId) {
    return articleCollection.deleteOne({ _id: articleId });
}

module.exports = {
    addUser,
    addArticle,
    addComment,
    getUserByAuth,
    getUserByUsername,
    getArticleById,
    getArticlesByUserId,
    getCommentByArticleId,
    setUser,
    setArticle,
    deleteUser,
    deleteArticle,
};