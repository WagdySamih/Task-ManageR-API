const express = require('express')
const multer = require('multer')
const User = require('../models/user.js')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCalcelationEmail} = require('../emails/account')


const router = new express.Router()

///Create A User and Save it to database!!
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        sendWelcomeEmail(user.Email, user.name)
        res.status(201).send({ user, token })      /// 201 Created status
    } catch (error) {
        res.status(400).send(error)     /// 400 error status 
    }
})

// login route
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredntials(req.body.Email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)     /// 400 error status 
    }
})
/// Logout a user!
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})
/// Logout all acounts
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

///Read my profile!!
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

})

/// Edit User Information
router.patch('/users/me', auth, async (req, res) => {

    ///first part for user to get correct message about his update 
    const allowedUpdates = ['name', 'age', 'Email', 'password']
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate)
        return res.status(400).send({ 'error': 'It is Not A Valid Update!!' })

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

/// Delete a User Account
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCalcelationEmail(req.user.Email, req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send('error deleting')
    }
})

const upload = multer({
    /// dest: 'avatars',  // removed for fun to pass file.buffer to it
    limits: {
        fileSize: 1000000
    }, fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('please upload an image!'))
        }
        callback(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // const buffer = await sharp().resize({ width: 250, height: 250  }).png().toBuffer()
    req.user.avatar = req.file.buffer
    await req.user.save()

    // jimp.read(req.file.buffer, (error, image) => {
    //     if (error) throw error
    //     image.resize(500, 500)
    //     req.user.avatar = new jimp( image.bitmap)
    //     console.log(req.user.avatar)
    //   // console.log(image.bitmap.data.Type())
    // })
    res.send()
}, (error, req, res, next) => {               /// error handling function so as not to send html error file!
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar)
            throw new error()

        res.set('content-Type', 'image/png')
        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()
    }

})



module.exports = router