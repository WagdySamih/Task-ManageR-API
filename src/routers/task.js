const express = require('express')
const Task = require('../models/task.js')
const auth = require('../middleware/auth')

const router = new express.Router()


///Create A Task and Save it to Database!!
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})
///Read All Tasks from Database!!
/// GET /tasks ? isCompleted = true                                       fetching completed or non completed tasks
/// GET /tasks ? limit =  & skip =                                        for  pagination
/// GET /tasks ? sortBy = createdAt:asc or  createdAt:desc                sorting by data/ compeletion
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.isCompleted) {
        match.isCompleted = (req.query.isCompleted === 'true') ///  req.query.isCompleted is a string type  
    }
    
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':') 
        sort[ parts[0] ] = (parts[1]==='asc') ?  1 : -1
    }

    try {   
        ///    const tasks = await Task.find({ owner: req.user._id })
        ///    await req.user.populate('tasks').execPopulate() 
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

///Read Single Task from Database!!
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task)
            return res.status(404).send()
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

/// Edit Task Information
router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['isCompleted', 'description']
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate)
        return res.status(400).send({ 'error': 'It is Not A Valid Update!!' })

    try {
        const task = await Task.findById({ _id: req.params.id, owner: req.user._id })
        if (!task)
            return res.status(404).send()

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        return res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

/// Delete a Task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task)
            return res.status(404).send()
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router