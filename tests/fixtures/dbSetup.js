const mongoose = require('mongoose')
const jwt=require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "WagdySamihBeshir",
    Email: "eng.wagdy.samih@gmail.com",
    password: "y0u-_-14&travel*",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "wagdy wagdy wagdy",
    Email: "eng.samih@wagdyl.com",
    password: "y0u-_-14&travel*",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}
const taskOneId = new mongoose.Types.ObjectId()
const taskOne = {
    _id: taskOneId,
    description: "Task1 by user1",
    isCompleted:false,
    owner:userOneId
}

const taskTwoId = new mongoose.Types.ObjectId()
const taskTwo = {
    _id: taskTwoId,
    description: "Task2 by user1",
    isCompleted:true,
    owner:userOneId
}

const taskThreeId = new mongoose.Types.ObjectId()
const taskThree = {
    _id: taskThreeId,
    description: "Task3 by user2",
    isCompleted:false,
    owner:userTwoId
}


const setupDatabase = async () => {
    await User.deleteMany({})
    await Task.deleteMany({})

    await new User(userOne).save()
    await new User(userTwo).save()

    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}
module.exports= {
    userOne,
    userTwo,
    userOneId,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}
