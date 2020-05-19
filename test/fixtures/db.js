const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const user = require('../../src/models/Users')
const task = require('../../src/models/Tasks')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name:'ahmed',
    email:'a5521@example.com',
    password:'a55215521!',
    tokens:[{
        token:jwt.sign({_id:userOneId} , process.env.JWT_SECRET)
       }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name:'momo',
    email:'momo@example.com',
    password:'mytest!',
    tokens:[{
        token:jwt.sign({_id:userTwoId} , process.env.JWT_SECRET)
       }]
}

const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    description: 'first Task',
    completed:true,
    owner : userOne._id
}

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    description: 'second Task',
    completed: false,
    owner : userOne._id
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    description: 'third Task',
    completed:true,
    owner : userTwo._id
}


const setupDatabase = async ()=>{
    await user.deleteMany()
    await task.deleteMany()
    await new user(userOne).save()
    await new user(userTwo).save()
    await new task(taskOne).save()
    await new task(taskTwo).save()
    await new task(taskThree).save()
}

module.exports = {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}