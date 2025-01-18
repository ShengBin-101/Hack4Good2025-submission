import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes for login
import authRoutes from './routes/auth.js';
// Routes for register
import { register } from './controllers/auth.js';
//Routes for create, update, delete, get all products
import productRoutes from './routes/product.js';
// For admin
import adminRoutes from './routes/admin.js';
// For create, approval, get all tasks
import taskRoutes from './routes/task.js'
// For task categories
import taskCategoryRoutes from './routes/taskCategory.js';
// For create, get all transactions
import transactionRoutes from './routes/transaction.js'
// For get user information via userId
import userRoutes from './routes/user.js'
// For quests
import questRoutes from "./routes/quest.js";
// For quest submissions
import questSubmissionRoutes from "./routes/questSubmission.js";

/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use(morgan("common"));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });


/*  Routes with Files */
app.post('/auth/register', upload.single('picture'), register); // For Register

/*  Routes */
app.use('/auth', authRoutes); // For Login
app.use('/products', productRoutes); // For create, update, delete, get all products
app.use('/admin', adminRoutes);
app.use('/tasks', taskRoutes); // For create, approval, get all tasks
app.use('/task-categories', taskCategoryRoutes);
app.use('/transactions', transactionRoutes); // For create, get all transactions
app.use('/users', userRoutes); // For get user information via userId
app.use("/quests", questRoutes); // For quests
app.use("/quest-submissions", questSubmissionRoutes); // For quest submissions

app.get('/test', (req, res) => {
    res.send('Server is running');
});


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => console.log(`${error} did not connect`));