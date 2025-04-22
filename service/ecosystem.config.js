// filepath: /Users/adamharris/Documents/school/CS260/startup/service/ecosystem.config.js
// This file is used to configure the PM2 process manager on the server.
// It sets the environment variable to "production"
module.exports = {
    apps : [{
      name   : "startup",
      script : "server.js",
      env: {
         NODE_ENV: "production"
      }
    }]
  }