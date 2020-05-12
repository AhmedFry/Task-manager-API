const express = require('express')
require('./db/mongoose')
const User = require('./models/Users')
const task = require('./models/Tasks')
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')
const auth = require('./middleware/auth')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port , ()=>{
    console.log('Server is up on Port : ', port)
})

// const bcrypt = require('bcrypt')

// const mycrypt = async()=>{
// const password = 'AhmedFry1123'

// const hashPassword = await bcrypt.hash(password , 8)
// console.log(password)
// console.log(hashPassword)

// const compare =await bcrypt.compare(hashPassword , 'AhmedFRy1123')
// console.log(compare)
// }
// mycrypt()

// const jwt = require('jsonwebtoken')
// const myFunction = () => {
//     const token = jwt.sign({name:"Ahmed"} , 'mynameahmed',{expiresIn:'1 seconds'})
//     console.log(token)
//     const data = jwt.verify(token , 'mynameahmed')
//     console.log(data)
// }
// myFunction()

// const main = async ()=>{
//     // const Task = await task.findById('5eb249fbc62698f52df31add')
//     // await Task.populate('owner').execPopulate()
//     // console.log(Task.owner)

//     const user = await User.findById('5eb248354ddd5b053aa0d40a')
//     await user.populate('userTask').execPopulate()
//     console.log(user.userTask)
    
// }
// main()