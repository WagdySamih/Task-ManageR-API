const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    userOne,
    userTwo,
    userOneId,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
} = require('./fixtures/dbSetup.js')


beforeEach(setupDatabase)

test('Valid Creation Of A Task', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "description": "finsish Testing this shit app",
            "isCompleted": false
        }).expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()

    expect(response.body).toMatchObject({
        "description": "finsish Testing this shit app",
        "isCompleted": false,
    })

    expect(JSON.stringify(response.body.owner)).toEqual(JSON.stringify(userOneId))
})

test('Valid Getting Only A User Tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const tasks = await Task.find({ owner: userOneId })
    expect(response.body.length).toBe(2)
})

test('valid Deletion of a task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const task = await Task.findById(taskTwo._id)
    expect(task).not.toBeNull()
})
test('invalid Deletion of a task! Did Not Authenticate', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
    const task = await Task.findById(taskTwo._id)
    expect(task).not.toBeNull()
})
test('Inviled Deletion of a task! Not same User task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskTwo._id)
    expect(task).not.toBeNull()
})

test('Valid Sorting For Tasks By Limit and Skip!', async () => {
    const response = await request(app)
        .get(`/tasks/?limit=1&skip=1`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body[0]).toMatchObject(
        {
            "description": "Task2 by user1"
        }
    ) 
    expect(response.body.length).toEqual(1)
})
test('Valid Sorting For Tasks By Time!', async () => {
    const response = await request(app)
        .get(`/tasks/?sortBy=createdAt:desc`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body[0]).toMatchObject(
        {
            "description": "Task2 by user1"
        }
    ) 
})
test('Valid Sorting For Tasks By IsCompleted!', async () => {
    const response = await request(app)
        .get(`/tasks/?isCompleted=true`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body[0]).toMatchObject(
        {
            "isCompleted": true
        }
    ) 
})