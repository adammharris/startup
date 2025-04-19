const express = require("express");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const DB = require("../database.js");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

function validatePassword(password, username) {
  // Password must be at least 8 characters long
  if (password.length < 8) {
    return { 
      valid: false, 
      reason: "Password must be at least 8 characters long" 
    };
  }

  // Password should not be the same as the username
  if (password.toLowerCase() === username.toLowerCase()) {
    return { 
      valid: false, 
      reason: "Password cannot be the same as your username" 
    };
  }

  // Password should contain at least one uppercase letter, one lowercase letter, and one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return { 
      valid: false, 
      reason: "Password must contain at least one uppercase letter, one lowercase letter, and one number" 
    };
  }

  // Password is valid
  return { valid: true };
}

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
}

async function createUser(username, password) {
  console.log("createUser: Creating user `"+username+"` with password `"+password+"`");
  
  // Validate password
  const validation = validatePassword(password, username);
  if (!validation.valid) {
    throw new Error(validation.reason);
  }
  
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
  console.log("createAuth: logging in `" + user.username + "`");
  const { accessToken, refreshToken } = generateTokens(user);

  res.cookie("access", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refresh", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// registration
router.post("/", async (req, res) => {
  console.log("registration: Received registration request: " + req.body.username);
  
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({ msg: "Username and password are required" });
  }
  
  if (await DB.getUserByUsername(req.body.username)) {
    console.log("registration: Registration rejected because user already exists")
    res.status(409).send({ msg: "Existing user" });
  } else {
    console.log("registration: Registration accepted")
    try {
      const user = await createUser(req.body.username, req.body.password);
      createAuth(res, user);
      res.send({ username: user.username });
    } catch (error) {
      res.status(400).send({ msg: error.message });
    }
  }
});

// login
router.put("/", async (req, res) => {
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
router.delete("/", async (req, res) => {
  const refresh = req.cookies['refresh'];
  let user = null;
  try {
    user = jwt.verify(refresh, JWT_REFRESH_SECRET);
  } catch (e) {
    console.log("logout: Invalid refresh token");
  }
  if (user) {
    console.log("logout: Logging out `"+user.username+"`");
    res.clearCookie('access', { path: '/' });
    res.clearCookie('refresh', { path: '/' });
  } else {
    console.log("logout: user not found, ignoring request")
  }
  res.send({});
});

// Note: getMe route removed as it's now provided by the users.js file

router.post("/refresh", (req, res) => {
  const refresh = req.cookies['refresh'];
  if (!refresh) {
    return res.status(401).send({ msg: "No refresh token" });
  }

  jwt.verify(refresh, JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).send({ msg: "Invalid refresh token" });

    const newAccess = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "15m" });
    res.cookie("access", newAccess, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.send({ msg: "Token refreshed" });
  });
});

router.get("/status", (req, res) => {
  const access = req.cookies['access'];
  const refresh = req.cookies['refresh'];
  if (access) {
    jwt.verify(access, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(200).send({ loggedIn: false });
      }
      res.status(200).send({ loggedIn: true, username: user.username });
    });
  } else {
    res.status(200).send({ loggedIn: false });
  }
});

module.exports = router;