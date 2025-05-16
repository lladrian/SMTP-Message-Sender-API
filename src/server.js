import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mailer from './utils/mailer.js'; // Import the mailer utility
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import moment from 'moment-timezone';


// Path to the JSON file acting as a database
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.resolve(__dirname, 'db.json');


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

// Helper function to load data from the JSON file
function loadData() {
  try {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist or is empty, return empty array
    if (err.code === 'ENOENT') {
      return [];
    } else {
      console.error('Error reading database file:', err.message);
      process.exit(1);
    }
  }
}

// Helper function to save data to the JSON file
function saveData(data) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing database file:', err.message);
    process.exit(1);
  }
}


function getFormattedDate() {
    const now = new Date();
  
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(now.getDate()).padStart(2, '0');
  
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function storeCurrentDateTime(expirationAmount, expirationUnit) {
      // Get the current date and time in Asia/Manila timezone
      const currentDateTime = moment.tz("Asia/Manila");
      // Calculate the expiration date and time
      const expirationDateTime = currentDateTime.clone().add(expirationAmount, expirationUnit);
  
      // Format the current date and expiration date
      const formattedExpirationDateTime = expirationDateTime.format('YYYY-MM-DD HH:mm:ss');


      // Return both current and expiration date-time
      return formattedExpirationDateTime;
  }

function  formatDate (date) {
    const pad = (n) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}



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

app.get('/visit_page', async (req, res) => { 
    try { 
        const data = loadData();
        //const ip = req.headers['x-forwarded-for']
       // const ip = req.headers['x-forwarded-for'].split(',')[0].trim();
        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '').split(',')[0].trim();
        const now = new Date();

        const newExpense = {
            id: randomUUID(), // Simple ID generation
            ip_address: ip,
            name : "",
            datetime: storeCurrentDateTime(0, 'hours'),
        };

        const recentVisit = data
            .filter(entry => entry.ip_address === ip)
            .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))[0];

        if (recentVisit) {
            const lastVisitTime = new Date(recentVisit.datetime);
            const diffMs = now - lastVisitTime;
            const diffMinutes = diffMs / (1000 * 60);

            if (diffMinutes < 20) {
                return res.status(200).json({ message: 'Duplicate entry within 20 minutes.' });
            }

            data.push(newExpense);
            saveData(data);

            return res.status(200).json({ message: 'Visit successfully added.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to add visit.' });
    }
});




app.get('/get_all_visit', async (req, res) => {   
    try {
        let data = loadData(); // This is a plain array, not a MongoDB query
        const { page = 1, limit = 10, sortBy = 'datetime', order = 'desc', ip_address } = req.query;

        // Optional filtering by IP address
        if (ip_address) {
            const ipRegex = new RegExp(ip_address, 'i');
            data = data.filter(entry => ipRegex.test(entry.ip_address));
        }

        // Optional sorting
        data.sort((a, b) => {
            const sortOrder = order === 'asc' ? 1 : -1;
            if (!a[sortBy] || !b[sortBy]) return 0;
            return (a[sortBy] > b[sortBy] ? 1 : -1) * sortOrder;
        });

        const total = data.length;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedData = data.slice(skip, skip + parseInt(limit));

        return res.status(200).json({
            data: paginatedData,
            page: Number(page),
            limit: Number(limit),
            total
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get all visit records.' });
    }
});

app.post('/add_message', async (req, res) => {                              
    try { 
        //const ip = req.headers['x-forwarded-for'] || req.ip;
       // const ip = req.ip;
        //const ip = req.headers['x-forwarded-for'];
        //123
        const ip = req.headers['x-forwarded-for'].split(',')[0].trim();
        const { email, name, message } = req.body;

        mailer(email, name, message, ip);
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

