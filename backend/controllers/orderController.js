import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/OrderModel.js';

//@desc     Create new order
//@route    Post /orders
//@access   Private
const addOrderItems = asyncHandler(async(req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    } = req.body;
    
    if(orderItems && orderItems.length == 0) {
        res.status(404);
        throw new Error('No order items');
    }
    else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });
        const createOrder = await order.save();
        res.status(201).json(createOrder);
    }
});

//@desc     Get logged in user orders
//@route    Get /orders/myorders
//@access   Private
const getMyOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find(({ user: req.user._id} ));
    res.status(200).json(orders);
});

//@desc     Get order by ID
//@route    Get /orders/:id
//@access   Private
const getOrderById = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if(order) {
        res.status(200).json(order);
    }
    else{
        res.status(404);
        throw new Error('Order not found');
    }
});

//@desc     Update order to paid
//@route    Put /orders/:id/pay
//@access   Private
const updateOrderToPaid = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };
        const updateOrderPayment = await order.save();
        res.status(200).json(updateOrderPayment);
    }
    else{
        res.status(404);
        throw new Error('Order not found');
    }
});

//@desc     update order to delivered
//@route    Put /orders/:id/deliver
//@access   Private/Admin
const updateOrderToDelivered = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrderDelivery = await order.save();
        res.status(200).json(updatedOrderDelivery);
    }
    else {
        res.status(404);
        throw new Error('Order not found');
    }
});

//@desc     Get all orders
//@route    Get /orders
//@access   Private/Admin
const getAllOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAllOrders
};