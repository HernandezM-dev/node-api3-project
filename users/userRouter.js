const express = require('express');
const db = require('./userDb');
const router = express.Router();

router.post('/', (req, res) => {
  // do your magic!
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

router.get('/', (req, res) => {
  // do your magic!
});

router.get('/:id', (req, res) => {
  // do your magic!
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  const id = req.params.id
  db.remove(id)
  .then(num =>{
    res.status(200).json({message: `successfuly deleted, Number of deleted users: ${num}`})
  })
  .catch(err =>{
    res.status(500).json({errorMessage: `could not delete user`, err})
  })
});

router.put('/:id', (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  return (req, res, next) =>{
    const id = Number(req.params.id)
    db.getById(id)
    .then(user =>{
      user ? req.user = user : res.status(400).json({ message: "invalid user id" })
    })
    .catch(err =>{
        res.status(500).json({errorMessage: "could not process request", err})
    })
    
    next()
  }
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
