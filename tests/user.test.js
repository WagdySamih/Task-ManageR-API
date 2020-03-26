const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {  userOne,  userOneId,    setupDatabase} = require('./fixtures/dbSetup')

beforeEach(setupDatabase)
test('Valid sign up new user!', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            "name": "wagdy samih!!",
            "Email": "wagdysamih787@gmail.com",
            "password": "mypass123"
        }).expect(201)
    /// Asserts that the database was created successfully
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({                       /// checking for saving response
        user: {
            "name": "wagdy samih!!",
            "Email": "wagdysamih787@gmail.com",
        },
        token: user.tokens[0].token
    })
    expect(response.body.user.password).not.toBe("mypass123")  /// checking for hashing password
})
test('Invalid sign up new user! Not Valid Credntials', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            "Email": "wagdysamih787@",
            "password": "password"
        }).expect(400)
})


test('Valid Login for existing account', async () => {
    const resopnse = await request(app)
        .post('/users/login')
        .send({
            Email: userOne.Email,
            password: userOne.password
        }).expect(200)

    const user = await User.findById(userOneId)
    expect(resopnse.body.token).toBe(user.tokens[1].token)
})

test('Invalid Login from wrong Email/password', async () => {
    await request(app)
        .post('/users/login')
        .send({
            Email: 'WrongMail@something.com',
            password: 'data1234'
        }).expect(400)
})

test('Valid show profile! Did Authenticate', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})


test('Invalid show profile! Did Not Authenticate', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Valid Delete Account! Did Authenticate', async () => {
   const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
    
})

test('Invalid Delete Acconut! Not Authenticate', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Valid Upload A Profile Photo', async()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','./tests/fixtures/killua.png')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(String))
})

test('Valid Update!',async()=>{
    await request(app)
        .patch('/users/me')
        .set('authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            "name": "WagdySamihBeshirGad",
            "age": 24
        }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.age).toBe(24)
    expect(user.name).toBe('WagdySamihBeshirGad')
})

test('A Not Valid Update! Invalid Fields', async()=>{
    await request(app)
    .patch('/users/me')
    .set('authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        "location":"Alexandria, Egypt"
    }).expect(400)

})

test('A Not Valid Update! Not Authenticate', async()=>{
    await request(app)
    .patch('/users/me')
    .send({
        "age":50
    }).expect(401)
})

test('A Not Valid Update! Invalid password', async()=>{
    await request(app)
    .patch('/users/me')
    .set('authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        "password":"123"
    }).expect(400)
})

test('A Not Valid Update! Invalid Email', async()=>{
    await request(app)
    .patch('/users/me')
    .set('authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        "Email":"wagdy@com"
    }).expect(400)
})
test('A Not Valid Update! Invalid name', async()=>{
    await request(app)
    .patch('/users/me')
    .set('authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        "name":""
    }).expect(400)
})