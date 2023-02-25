const mongoose =require('mongoose')


const menuSchema = new mongoose.Schema({
    restaurant:{
        type: String,
        trim: true
    },
    food:{
        type: String,
        trim: true
    },
    drink:{
        type: String,
        trim: true
    },
    owner: {
        type: String,
        ref: 'User',
        trim: true
    }
}, {
    timestamps: true
})


const Menu = mongoose.model('Menu', menuSchema)



module.exports = Menu