const express = require('express')
const projectDB = require('../data/helpers/projectModel')
const router = express.Router()

router.get('/', (req, res) => {
    projectDB.get()
    .then(projects => {
      res.status(200).json(projects)
    })
    .catch(err => {
      res.status(500).json({ message: 'Error getting projects', err })
    })
})


router.get('/:id', verifyPostId, (req, res) => {
    const id = req.params.id
    projectDB.get(id)
    .then((project) => {
        if (project.name) {
            res.status(200).json(project)
        }
    })
    .catch(err => {
        res.status(404).json({
            message: `Can't find project with id=${id}`, err
        })
    })
})

router.post('/', verifyPost, (req, res) => {
  const newProject = req.body
    .then(newProj => {
      console.log('Project created!')
      res.status(201).json(newProj)
    })
    .catch(err => {
      res.status(500).json({ message: 'Error adding new project', err })
    })
})

router.put('/:id', verifyPostId, (req, res) => {
    const id = req.params.id
    const projectUpdate = req.body
    projectDB.update(id, projectUpdate)
      .then(updatedProject => {
        res.status(200).json(updatedProject)
      })
      .catch(err => {
        res.status(500).json({ message: 'Error updating project', err })
      })
  })
  
router.delete('/:id', verifyPostId, (req, res) => { 
    const id = req.params.id
    projectDB.remove(id)
        .then(deleted => {
        res.status(200).json(deleted)
            }) 
        .catch(err => {
            res.status(500).json({ message: 'Error deleting project', err })
        })
})

router.get('/:id/actions', verifyPostId, (req, res) => {
    const id = req.params.id
    projectDB.getProjectActions(id)
        .then(actions => {
        res.status(200).json(actions)
        })
        .catch(err => {
        res.status(500).json({ message: 'Error retrieving actions', err })
        })
})

// *** MIDDLEWARE ***

function verifyPost(req, res, next) {
    if (!req.body.name || !req.body.description) {
      res.status(404).json({message: 'you are missing either, or both of: name and description')
    } else {
      next()
    }
  }
  
  function verifyPostId(req, res, next) {
    projectDB.get(req.params.id)
      .then(post => {
        if (post) {
          next()
        } else {
          res.status(404).json({message: `post ${req.params.id} does not exist `})
        }
      })
  }
module.exports = router