const User = require('../model/User')
const jwt = require('jsonwebtoken')

//handle errors

const handleErrors = (e) => {
    console.log(e.message, e.code);
    let errors = { email: '', password: '', roles:''}

    //incorrect email
    if(e.message === 'incorrect email'){
        errors.email = 'your email is not registered'
    }

    if(e.message === 'incorrect password'){
        errors.password = 'your password is not correct'
    }

    //unique error code
    if(e.code===11000){
        errors.email = 'email already registered'
        return errors
    }

    if(e.code === 401){
        errors.roles = 'Admin requires a unique password'
        return errors
    }

    //validation errors
    if(e.message.includes('user validation failed'))
    Object.values(e.errors).forEach(({properties}) =>{
        errors[properties.path] = properties.message;
    })
    return errors
}



//create token

const maxAge = 12 * 60 * 60 //this ex-pects a time in seconds and not milliseconds

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) =>{
    res.render('signup');
}

module.exports.login_get = (req, res) =>{
    res.render('login');
}

module.exports.signup_post = async (req, res) =>{
    const {email, password, name, roles} = req.body

    try{
        if(req.body.roles==="Admin" && req.body.password !== 'olayiwola12'){
            const errMsg = 'Admin Password Needed'
            return res.status(401).json({message: errMsg})
        }
       const user = await User.create({email, password, name, roles});
       const token = createToken(user._id)
       res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
       res.status(201).json({user: user._id, roles: user.roles})
    }catch(e){
        const errors = handleErrors(e)
        res.status(400).json({errors})
    }
}


module.exports.login_post = async (req, res) =>{
    const {email, password} = req.body
    console.log(req.body)

    try{
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({user: user._id, roles: user.roles})
    }catch(e){
        const errors = handleErrors(e)
        res.status(409).json({ errors })
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1 })
    res.redirect('/');
}