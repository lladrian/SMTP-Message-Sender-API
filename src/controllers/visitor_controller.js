import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
import Visitor from '../models/visitors.js';
//import mailer from '../utils/mailer.js'; // Import the mailer utility
import mailer from '../utils/mailer_resend.js'; // Import the mailer utility
import { DateTime } from "luxon";



// Function to get the current date and time in Asia/Manila and store it in the database
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
export const get_ip_address = asyncHandler(async (req, res) => {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '').split(',')[0].trim();

    return res.status(200).json({ data: ip });
});

export const visit_page = asyncHandler(async (req, res) => {
    try {
        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '').split(',')[0].trim();
       // const now = new Date();
        const now = DateTime.now().setZone("Asia/Manila");
  

        const newVisitor = new Visitor({
            ip_address: ip,
            name: "",
            visited_at: storeCurrentDateTime(0, 'hours'),
        });


        const recentVisit = await Visitor.findOne({ ip_address: ip })
        .sort({ visited_at: -1 }) // latest first
        .exec();
        
        if (recentVisit) {
            const lastVisitTime = DateTime.fromFormat(recentVisit.visited_at, "yyyy-MM-dd HH:mm:ss", { zone: "Asia/Manila" });
            const diffMinutes = now.diff(lastVisitTime, "minutes").toObject().minutes;
            //const lastVisitTime = new Date(recentVisit.visited_at);
            //const diffMs = now - lastVisitTime;
            //const diffMinutes = diffMs / (1000 * 60);

            if (diffMinutes < 1) {
                return res.status(200).json({ message: 'Duplicate entry within 1 minute.' });
            }
        }

        await newVisitor.save();

        return res.status(200).json({ message: 'Visit successfully added.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create visit.' });
    }
});


export const add_message  = asyncHandler(async (req, res) => {    
     try { 
        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '').split(',')[0].trim();
        const { email, name, message } = req.body;
        
        mailer(email, name, message, ip);
 
        return res.status(200).json({ message: 'Message successfully added.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to add visit.' });
    }
});

export const get_all_visit = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'visited_at', // assuming you meant 'visited_at' not 'datetime'
      order = 'desc',
      ip_address
    } = req.query;

    const query = {};

    // Optional filtering by IP address using regex (case-insensitive)
    if (ip_address) {
      query.ip_address = new RegExp(ip_address, 'i');
    }

    const sortOrder = order === 'asc' ? 1 : -1;

    const total = await Visitor.countDocuments(query);

    const data = await Visitor.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    return res.status(200).json({
      data,
      page: Number(page),
      limit: Number(limit),
      total
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to get all visit records.' });
  }
});