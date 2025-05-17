import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import visitorRoutes from "./routes/visitor_route.js";
import connectDB from "./config/db.js";


// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    keyGenerator: (req, res) => {
        // Get the IP address
        const ip = req.headers['x-forwarded-for'] || req.ip;
        return ip;
    }
});


dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.set('trust proxy', true);


app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.use("/visitors", visitorRoutes);

connectDB();
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;

