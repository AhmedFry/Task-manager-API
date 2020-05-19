const request = require('supertest')
const app = require('../src/app')
const task = require('../src/models/Tasks')
const { userOneId,
        userTwoId,
        userOne,
        userTwo,
        taskOne,
        taskTwo,
        taskThree,
        setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('should create task for user' , async()=>{
    const response = await request(app)
        .post('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            description : 'From test'
        })
        .expect(201)

    const myTask = await task.findById(response.body._id)
    expect(myTask).not.toBeNull()
    expect(myTask.completed).toEqual(false)
})

test('Should read all tasks', async()=>{
    const response = await request(app).get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    expect(response.body.length).toEqual(2)
    
})

test('Should delete task from user' , async()=>{
    const response = await request(app).delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

        console.log(response.body)
    //assert the task is still in database
    const myTask = await task.findById(taskOne._id)
    expect(myTask).not.toBeNull()
})