const express = require('express');
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware')
const Posts = require('../posts/posts-model');
const Users = require('./users-model')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get(req.query)
  .then(users =>{
      res.status(200).json(users)
  })
  .catch(err =>{
      console.log(err)
      res.status(404).json(
          {message: "User not found."}
      )
  })
});

router.get('/:id',validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  const {id} = req.params
  Users.getById(id)
    .then(user =>{
      res.status(200).json(user)
    })
    .catch(error =>{
      console.log(error)
      res.status(500).json({message: "Server failed"})
    })
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
  .then( user =>{
      res.status(400).json(user)
  })
  .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.body)
    .then( user => {
        res.status(200).json(user)
    })
    .catch(next)
});

router.delete('/:id', validateUserId,  (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
    Users.remove(req.params.id)
            .then(() =>{
            res.status(200).json({ message: 'User deleted!'})
        })
        .catch(next)
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
    Users.getUserPosts(req.params.id)
        .then(user =>{
            res.status(200).json(user)
        })
        .catch(next)
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const userId = req.params.id;
  const newPost = {...req.body, userId: userId}
  Posts.insert(newPost)
    .then( post =>{
        res.status(200).json(post)
    })
    .catch(next)
});

// do not forget to export the router

module.exports = router