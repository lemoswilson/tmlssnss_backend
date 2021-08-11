import dotenv from 'dotenv';
dotenv.config();
import '../config/passport';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from '../routes/userRoutes'
import passport from 'passport';


const port = process.env.PORT || 5000
console.log(process.env.ATLAS_URI);

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize())

// routes
app.use('/users', userRouter);

mongoose.connect(process.env.ATLAS_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
	console.log('mongodb database connection established');
})

app.listen(port)