import express from 'express'
import { placeOrder, placeOrderStripe, userOrders, allOrders, updateStatus } from '../controllers/orderController.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

//Admin features
orderRouter.post('/list',allOrders)
orderRouter.post('/status',updateStatus)

//Payment features
orderRouter.post('/place',authUser, placeOrder)
orderRouter.post('/stripe',authUser, placeOrderStripe)

//User feature
orderRouter.post('/userOrders',authUser, userOrders)

export default orderRouter