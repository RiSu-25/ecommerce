import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors'
import ConnectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js';
import cartRouter from './routes/cartRoute.js';


// Load environment variables
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 4000
connectDB();
ConnectCloudinary();


// Middleware to parse JSON
app.use(express.json());
app.use(cors())

//api endpoints
app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);


app.get('/',(req,res)=>{
    res.send("API Working")
})



// Start the server

app.listen(port, () => {
    console.log('Server is running on port : ' +port);
});
