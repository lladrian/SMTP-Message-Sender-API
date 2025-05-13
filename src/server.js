import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mailer from './utils/mailer.js'; // Import the mailer utility


dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});


app.post('/add_message', async (req, res) => {    
    try { 
        const { email, name, message } = req.body;

        mailer(email, name, message);
        return res.status(200).json({ message: 'Message successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create message.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;

