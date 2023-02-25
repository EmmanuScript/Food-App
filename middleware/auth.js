const jwt = require('jsonwebtoken')
const User = require('../model/User')



const requireAuth = (req, res, next) =>{

    const token = req.cookies.jwt;
    //check if webtoken exists
    if(!token){
        return res.redirect('/login')
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=>{
        if(err){
            console.log(err.message)
            return res.redirect('/login')
        }
        next()
    })
}


//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
                req.locals.user = null
                next()
            }
            let user = await User.findOne({_id: decodedToken.id});
            req.user = user
            res.locals.user = user
            next()
        })
    }else{
        res.locals.user = null;
        next()
    }
}

const authRole = async (req, res, next) =>{
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
                req.locals.user = null
                next()
            }
            let user = await User.findOne({_id: decodedToken.id});
            if(user.roles==='Admin'){
                res.locals.user = user
                next()
            }else{
                res.redirect('/home')
            }
        })
}
}

module.exports = {
    requireAuth,
    checkUser,
    authRole
}