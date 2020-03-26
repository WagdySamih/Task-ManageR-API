const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0)
                throw new Error('Age Must Be Greater Than Zero! ')
        }
    },
    Email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('Email Adress Is Not Valid')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (value.toLowerCase().includes("password"))
                throw new Error('Password Can not contain the word "password"!')
        }
    },
    avatar: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

/// Hide Non Useful information
userSchema.methods.toJSON = function () {
    const user = this
    const userObejct = user.toObject()

    delete userObejct.tokens
    delete userObejct.password
    delete userObejct.avatar

    return userObejct
}

/// user task relation
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


/// userSchema instance Fun to create a token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

/// 
userSchema.statics.findByCredntials = async (Email, password) => {
    const user = await User.findOne({ Email })
    if (!user)
        throw new Error('Unable To Login!')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
        throw new Error('Unable To Login!')

    return user
}



///midleware for hashing fun before saving it!
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

///midleware for deleting tasks for removed account!
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
