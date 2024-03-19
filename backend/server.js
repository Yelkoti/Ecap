import path from 'path';
import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import productRoutes from "./routes/productRoutes.js";
import userRoutes from './routes/userRoutes.js';
import orderRooutes from './routes/orderRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cookie parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("API is Running")
});

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRooutes);
app.use('/upload', uploadRoutes);
app.get('/api/config/paypal', (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID}));

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server is running on port ${port}`));