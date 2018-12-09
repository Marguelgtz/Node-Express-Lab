// import your node modules
const express = require('express');
const db = require('./data/db.js');

const server = express();
const parser = express.json();
const PORT = 4000;

server.use(parser);

// endoints

// Get all posts
server
  .get('/api/posts', (req, res) => {
    db.find()
      .then(posts => {
        res.json(posts)
      })
      .catch(err => { 
        res
          .status(500)
          .json({message: 'failed to get posts'})
      })
  })

//get post by id
server
  .get('/api/posts/:id', (req, res) => {
    const {id} = req.params;
    db.findById(id) 
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

//add post
server
  .post('/api/posts', (req, res) => {
    const post = req.body;
    if(post.title && post.contents){
      db.insert(post)
        .then(idInfo => {
          db.findById(idInfo.id)
            .then(post => {
              res
                .status(201)
                .json(post[0])
            })
        })
        .catch(err => {
          res.status(500)
            .json({message: 'failed to insert post'})
        });
    } else {
      res
        .status(400)
        .json({message: "Missing title or content"})
    }
  })

//Post delete
server  
  .delete('/api/posts/:id', (req,res) => {
    const {id} = req.params;
    // Gets the post title before is deleted to be able to send it as an response
    const postTitle = 
      db.findById(id)
        .then(post => {
          res
            .json({message: `${post[0].title} has been deleted`})
        })

    db.remove(id)
      .then(count => {
        if(count){
          //something has been deleted
          //send back post
          postTitle;
        } else {
          //item already deleted or never existed
          res
            .status(404)
            .json({message: "invalid id"})
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({message: "failed to delete post"})
      });
  })

//Updating post
server
  .put('/api/posts/:id', (req, res) => {
    const post = req.body;
    const {id} = req.params;
    if(post.title && post.contents){
      db.update(id, post)
        .then(count => {
          if(count){
            db.findById(id)
              .then(post => {
                res
                  .json(post[0])
              })
          } else {
            res
              .status(404)
              .json({message: "Invalid id"})
          }
        })
        .catch(err => {
          res
            .status(500)
            .json({message: "Failed to update post"})
        });
    } else {
      res
        .status(400)
        .json({message: "Missing title or content"})
    }
  })

// Listening 
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})