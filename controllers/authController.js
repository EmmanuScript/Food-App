const Order = require('../model/Order')


module.exports.make_order_get = (req, res) => {
    res.render('make-order')
}

module.exports.make_order_post = async (req, res) => {
    
    //creating a new order every time input is made on client side
    const order = new Order({
        ...req.body,
        owner: req.body.name
    })

    try{
        await order.save()
        res.status(201).json({ order })
    }catch(e){
        res.status(400).send(e)
    }
}


module.exports.get_orders = async (req, res) => {
    const name = req.user.name
    console.log(req.user.name)
    const order = await Order.find({owner: name})

    try{
        let meal = []
        order.forEach(ord =>{
            meal.push(ord.restaurant, ord.food, ord.drink)
        })

        res.status(200).json(order)
        console.log(meal)
        req.order = order
        res.locals.order = order
    }catch(e){
        res.status(400).send(e)
    }
}

module.exports.edit_order = async (req, res)=>{
    let id = req.body.id
    let newRestaurant = req.body.restaurant
    let newFood = req.body.food
    let newDrink = req.body.drink
    console.log(req.body)
    
    try{
        const filter = {_id: id}
        const update = {restaurant: newRestaurant, food: newFood, drink: newDrink}
        const order = await Order.findOneAndUpdate(filter, update)
        res.status(200).json({order})
    }catch(e){
        console.log(e)
    }

}

module.exports.delete_order = async (req, res) => {
    let id = req.body.id

    try{
        const order = await Order.findOneAndDelete({_id:id})
        console.log(order)
    }catch(e){
        console.log(e)
    }
}


module.exports.index = async (req, res) => {
    res.render('index')
}

