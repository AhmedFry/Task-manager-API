const express = require('express')
const task = require('../models/Tasks')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/tasks', auth ,async (req,res)=>{
    //const Task = new task(req.body)
    const Task = new task({
        ...req.body,
        owner : req.user._id
    })
    try{
    await Task.save()
    res.status(201).send(Task)
    }catch(e){
        res.status(400).send()
    }
})

    //GET /tasks?completed=true
router.get('/tasks' , auth , async (req,res)=>{
    const match = {}
    const sort = {}
    if (req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    try{               
        await req.user.populate({
            path: 'userTask',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort:{
                    completed : 1 // 1 or -1
                }
            }
        }).execPopulate()
        res.status(200).send(req.user.userTask)

        // Tasks = await task.find({owner : req.user._id})
        // res.status(200).send(Tasks)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/tasks/:id' , auth , async (req,res)=>{
    const _id = req.params.id
    try{
        const Task = await task.findOne({_id , owner : req.user._id})
        if(!Task){
            return res.status(404).send()
        }
        res.status(200).send(Task)

    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id' , auth , async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description' , 'completed']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    
    if(!isValidOperation){
        return res.status(400).send({Error : "Invalid update"})
    }
    try{
        const Task = await task.findOne({_id:req.params.id , owner: req.user._id})

        if(!Task){
            return res.status(400).send()
        }       

        updates.forEach((update) => Task[update] = req.body[update])
        await Task.save()
        res.send(Task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id' ,auth, async(req,res)=>{
    try{
        const Task = await task.findOneAndDelete({_id:req.params.id , owner:req.user._id})
        if(!Task){
            res.status(404).send()
        }
        res.send(Task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router