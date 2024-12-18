import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'

//Global variables for payment
// const currency = 'usd'
// const deliveryCharge = 10

//Stripe gateway initialization
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
// console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);


//Placing order using COD method
const placeOrder = async (req,res) => {
    try {
        // Decode userId from token (optional, if not sent in req.body)
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Validate required fields
        const { items, amount, address } = req.body;

        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear user's cart after placing the order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//Placing order using stripe method
const placeOrderStripe = async (req,res) => {
    // try {
    //     const { userId, items, amount, address } = req.body
    //     const {origin} = req.headers;

    //     const orderData = {
    //         userId,
    //         items,
    //         address,
    //         amount,
    //         paymentMethod: "Stripe",
    //         payment: false,
    //         date: Date.now()
    //     };

    //     const newOrder = new orderModel(orderData);
    //     await newOrder.save();

    //     const line_items = items.map((item) => ({
    //         price_data: {
    //             currency: currency,
    //             product_data: {
    //                 name:item.name
    //             },
    //             unit_amount: item_price * 100
    //         },
    //         quantity: item.quantity
    //     }))
    //     line_items.push({
    //         price_data: {
    //             currency: currency,
    //             product_data: {
    //                 name: 'Delivery Charges'
    //             },
    //             unit_amount: deliveryCharge * 100
    //         },
    //         quantity: 1
    //     })

    //     const session = await stripe.checkout.sessions.create({
    //         success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`, //when payment get success we will get this link
    //         cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    //         line_items,
    //         mode: 'payment',
    //     })

    //     res.json({success: true, session_url:session.url});

    // } catch (error) {
    //     console.log(error);
    //     res.json({success: false, message: error.message})
    // }
}

//all orders data for admin panel 
const allOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success: true, orders})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

//all update for admin panel 
const updateStatus = async (req,res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success: true, message: 'Status Updated'})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

//User Orders Data for Frontend
const userOrders = async (req,res) => {
    try {
        const { userId } = req.body
    
        const orders = await orderModel.find({ userId })
        res.json({success: true, orders})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export { placeOrder, placeOrderStripe, userOrders, allOrders, updateStatus }