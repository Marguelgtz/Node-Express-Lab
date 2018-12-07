// import your node modules
const express = require('express');
const db = require('./data/db.js');


const server = express();
const PORT = 4000;
// add your server code starting here

// Get all posts
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

server
  .get('/api/posts/:id', (req, res) => {
    const {id} = req.params;
    db
      .findById(id) 
      .then(post => {
        console.log(post);
        if(post[0]) {
          res.json(post[0])
        } else {
          res
            .status(404)
            .json({message: "Post does not exist"})
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({message: 'Failed to get post'})
      })
  })

// Listening 
server.listen(PORT, () => {
  console.log(`Server runnign on port ${PORT}`)
})