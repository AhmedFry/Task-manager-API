const express = require('express')
const User = require('../models/Users')
const auth = require('../middleware/auth')
const sharp =require('sharp')
const {sendWelcomeEmail,sendCancelationEmail} = require('../email/account')
const router = new express.Router()

//Create a new user
router.post('/users' , async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email , user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})
// Read profile
router.get('/user/me' , auth ,async (req,res)=>{
    res.send(req.user)
})

//update info. about profile
router.patch('/users/me' ,auth, async (req , res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name' , 'email' , 'password' , 'age']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({Error : 'Invalid update'})
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

//delete account
router.delete('/users/me' ,auth , async(req,res)=>{
    try{
        await req.user.remove()
        sendCancelationEmail(req.user.email , req.user.name) 
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})


//login 
router.post('/users/login' , async (req , res)=>{
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.generateAuthToken()

        res.send({user , token})
    }catch(e){
        res.status(400).send()
    }
})

//logout from current device
router.post('/users/logout' , auth , async(req , res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//logout from all devices
router.post('/users/logoutall' , auth , async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

const multer = require('multer')
const avatars  = multer({
    limits :{
        fileSize:1000000
    },
    fileFilter (req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpgp|png)$/)){
            return cb(new Error('please upload image file'))
        }
        cb(undefined , true)
    }
})

//upload a pic
router.post('/users/me/avatars',auth , avatars.single('Avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer()
    req.user.Avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>
{
    res.status(400).send({error:error.message})
}
)
//delete a pic 
router.delete('/users/me/avatars' , auth , async (req,res)=>{
    try{
        req.user.Avatar = undefined
        await req.user.save()
        res.send()
    }catch(e){
        res.status(400).send('not found')
    }
})
//show a pic 
router.get('/users/:id/avatars' , async(req,res)=>{
    try{
    const user = await User.findById(req.params.id)
    
    if(!user || !user.Avatar){
        throw new Error()
    }
    res.set('Content-Type','image/png')
    res.send(user.Avatar)
    }catch(e){
        res.status(404).send()
    }
} )


module.exports = router 