const express = require('express');
const db = require('./userDb');
const postDb = require('../posts/postDb')
const { insert } = require('../data/dbConfig');
const router = express.Router();

router.post('/', validateUser, validatePost(), (req, res) => {
  db.insert(req.body)
  //could improve by checking if name is unique and displaying corresponding error
  .then(user =>{
    res.status(200).json(user)
  })
  .catch(err =>{
    res.status(500).json({message: "Could not process new user", err})
  })
});

router.post('/:id/posts', validateUserId(),  (req, res) => {
    postDb.insert(req.body)
    .then(post =>{
      res.status(200).json(post)
    })
    .catch(err =>{
      res.status(500).json({message: "could not process post"})
    })
});

router.get('/', (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(500).json('cant retrieve users', err)
    })
});

router.get('/:id', validateUserId(), (req, res) => {
  console.log(req.user.id)
  res.status(200).json(req.user)
  // const id = req.params.id
  // db.getById(id)
  //   .then(user => {
  //     res.status(200).json(user)
  //   })
  //   .catch(err => {
  //     res.status(500).json({ message: "unable to retrieve user", err })
  //   })
});

router.get('/:id/posts', validateUserId(), (req, res) => {
  db.getUserPosts(req.user.id)
  .then(posts =>{
    res.status(200).json(posts)
  })
  .catch(err =>{
    res.status(500).json({message: "Could not process request"})
  })
});

router.delete('/:id', validateUserId(), (req, res) => {
  const id = req.params.id
  db.remove(id)
    .then(num => {
      res.status(200).json({ message: `successfuly deleted, Number of deleted users: ${num}` })
    })
    .catch(err => {
      res.status(500).json({ errorMessage: `could not delete user`, err })
    })
});

router.put('/:id', (req, res) => {
  const id = req.params.id
  const body = req.body


  if (body.name) {
    db.update(id, body)
      .then(res => {
        res === 1
          ? res.status(200).json({ message: "Successfully Updated" })
          : res.status(400).json({ message: "Could not update user" })
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "unable to process update", err })
      })
  } else
    res.status(400).json({ errorMessage: "Please Provide Name" })




});

//custom middleware

function validateUserId() {
  return function (req, res, next) {
    const id = Number(req.params.id)
    db.getById(id)
      .then(user => {
        user ? req.user = user : res.status(400).json({ message: "invalid user id" })
        next();
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "could not process request", err })
      }) 
  }
}

function validateUser(req, res, next) {
  req.body && req.body.name 
  ? next() 
  : !req.body ? 
    res.status(400).json({errorMessage: "Missing user data"})
    : res.status(400).json({ message: "missing required name field" })
}

function validatePost(req, res, next) {
  return function (req, res, next) {
    req.body && req.body.text 
    ? next() 
    : !req.body ? 
      res.status(400).json({errorMessage: "Missing user data"})
      : res.status(400).json({ message: "missing required test field" })
  }
}

module.exports = router;
