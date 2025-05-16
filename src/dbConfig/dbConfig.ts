import mongoose from 'mongoose';


export async function connectDB() {
    try {
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });
        connection.on('error', (error) => {
            console.log('Error connecting to MongoDB, Please check your connection string');
            console.log(error);
            process.exit();
        });
        
    } catch (error) {
        console.log('Something went wrong in connecting to the database');
        console.log(error);
        
    }
}