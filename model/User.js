const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcryptjs');
const Order = require('./Order');
const { string } = require('yargs');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter your name'],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail , 'please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    roles:{
        type: String,
        enum: ['User', 'Admin'],
        default: 'User',
        required: true
    }
});

//populating the owner keys with the user id
userSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'owner'
})

//hash the password before saving it to the database
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
});



//static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email});

    if(!user){
        throw Error('incorrect email')
    }
    const auth = await bcrypt.compare(password, user.password)
    if(!auth){
        throw Error('incorrect password');
    }
    return user;
}

userSchema.post('save', function (doc, next){
    console.log('new user was created and saved', doc)
    next()
});

const User = mongoose.model('user', userSchema);

module.exports = User