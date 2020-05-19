const request = require('supertest')
const app = require('../src/app')
const user = require('../src/models/Users')
const {userOneId , userOne , setupDatabase } = require('./fixtures/db')


beforeEach(setupDatabase)

test('Should sign up a new user', async()=>{
    const response = await request(app).post('/users').send({
        name:"saeed",
        email:"sasa@example.com",
        password:"saeed1123"
    }).expect(201)

    //Assert the database was change correctly
    const myUser = await user.findById(response.body.user._id)
    expect(myUser).not.toBeNull()
    
    //Assertions about the response 
    expect(response.body).toMatchObject({
        user : {
            name: 'saeed',
            email: 'sasa@example.com'
        },
        token: myUser.tokens[0].token
    })
    expect(user.password).not.toBe('saeed1123')
})

test('Should login existing user' , async()=>{
    const response =await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
    const myUser = await user.findById(userOneId)
    expect(response.body.token).toBe(myUser.tokens[1].token)
})

test('Should not login nonexisting user' , async()=>{
    await request(app).post('/users/login').send({
        email:"aa1125",
        password:"12345555"
    }).expect(400)
})

test('Should get profile for user' , async()=>{
    await request(app).get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthentication user' , async()=>{
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async()=>{
    const response = await request(app).delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    
    const myUser = await user.findById(userOneId)
    expect(myUser).toBeNull()
})

test('Should not delete account for unauthentication user', async()=>{
    await request(app).delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async()=>{
    await request(app).post('/users/me/avatars')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('Avatar','test/fixtures/profile-pic.jpg')
    .expect(200)

    const myUser = await user.findById(userOneId)
    expect(myUser.Avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields' , async()=>{
    await request(app).patch('/users/me')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'AhmedF'
    }).expect(200)

    const myUser = await user.findById(userOneId)
    expect (myUser.name).toBe('AhmedF')
})

test('Should not update invalid user fields' , async()=>{
    await request(app).patch('/users/me')
    .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
    .send({
        location:'Banha'
    }).expect(400)

})