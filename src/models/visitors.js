import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
  ip_address: { 
    type: String, 
    required: true
  },
  name: { 
    type: String, 
    required: true
  },
  visited_at: {
    type: String,
    default: null
  },
});

export default mongoose.model('Visitor', VisitorSchema);