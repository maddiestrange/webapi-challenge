const express = require('express')
const router = express.Router()
const actionDB = require('../data/helpers/actionModel')

router.get('/', (req, res) => {
    actionDB.get()
      .then(actions => {
        res.status(200).json(actions)
      })
      .catch(err => {
        res.status(500).json({ message: 'Error retrieving actions', err })
      })
  })

router.get('/:id', verifyActionId, (req, res) => { 
    const id = req.params.id
    actionDB.get(id)
        .then(action => {
          res.status(200).json(action)
        })
        .catch(err => {
        res.status(500).json({ message: `We couldn't find an action by ID=${id}.`, err})
        })
})
            
                
router.post('/', verifyAction, (req, res) => {
    const action = req.body
    actionDB.insert(action)
    .then((action) => {
        console.log('Action created!')
        res.status(201).json(action)
    })
    .catch(() => {
        res.status(500).json({error: 'There was an error adding the action to the database.'})
    })
})

router.delete('/:id', verifyActionId, (req, res) => { 
    const id = req.params.id
    actionDB.remove(id)
    .then(deleted => {
        res.status(200).json(deleted)
      })
      .catch(err => {
        res.status(500).json({ message: 'Error deleting action', err })
      })
})

router.put('/:id', verifyAction, verifyActionId, (req, res) => { 
    const id = req.params.id
    const changes = req.body
    console.log(id, changes)

    actionDB.update(id, changes)
    .then(update => {
        res.status(200).json(update)
      })
      .catch(err => {
        res.status(500).json({ message: 'Error updating action', err })
      })
})

// *** MIDDLEWARE ***

function verifyAction(req, res, next) {

    if (!req.body.project_id || !req.body.description || !req.body.notes) {
      res.status(404).json({message: 'you are missing one or multiple of: project_id, description, and notes'})
    } else {
      actionDB.get(req.body.project_id)
      .then(post => {
        if (post) {
          next()
        } else {
          res.status(404).json({message: `post ${req.body.project_id} does not exist `})
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({message: 'server error inside verifyAction'})
      }) 
    }
  }
  
  function verifyActionId(req, res, next) {
    const id = req.params.id
    actionDB.get(id)
      .then(action => {
        action
          ? next()
          : res
              .status(404)
              .json({ message: `No action with the provided ID=${id} exists` })
      })
      .catch(err => {
        res.status(500).json({ message: 'Error retrieving action', err })
      })
  }

module.exports = router