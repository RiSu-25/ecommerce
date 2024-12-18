import mongoose from 'mongoose';

const connectDB = async () => {
    
    mongoose.connection.on('connected', () => {
        console.log("DB CONNECTED");
    })

    await mongoose.connect(`${process.env.MONGO_URI}/E-Commerce`)
};

export default connectDB;
