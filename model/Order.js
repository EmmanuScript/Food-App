const mongoose =require('mongoose')
const { string } = require('yargs')


const orderSchema = new mongoose.Schema({
    restaurant:{
        type: String,
        trim: true,
        required: true
    },
    food:{
        type: String,
        default: false
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

const Order = mongoose.model('Order', orderSchema)



module.exports = Order