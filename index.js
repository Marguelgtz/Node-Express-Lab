// import your node modules
const express = require('express');
const db = require('./data/db.js');


const server = express();
const PORT = 4000;
// add your server code starting here

server
  .get('/api/posts', (req, res) => {
    db
      .find()
      .then(posts => {
        res.json(posts)
      })
      .catch(err => {
        res
          .status(500)
          .json({message: 'failed to get posts'})
      })
  })

// Listening 
server.listen(PORT, () => {
  console.log(`Server runnign on port ${PORT}`)
})