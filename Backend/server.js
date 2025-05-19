import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config()
const app = express();

// Middleware
app.use(cors());
app.use(express.json());/* For parsing incoming JSON */

app.get('/',(req,res)=>{
    res.send('Welcome to the server')
})

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () =>
            console.log(`✅ Server running on port ${process.env.PORT}`)
        );
    })
    .catch(err => console.error('MongoDB Error:', err));


