

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const detailsRoute=require("./details/details.route");
const Sales = require("./details/details.model");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/details",detailsRoute)

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/salesdb")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Mongoose Schema
// const salesSchema = new mongoose.Schema({
//   header_table: {
//     vr_no: String,
//     vr_date: Date,
//     ac_name: String,
//     ac_amt: Number,
//     status: String
//   },
//   details_table: [
//     {
//       sr_no: Number,
//       item_code: String,
//       item_name: String,
//       description: String,
//       qty: Number,
//       rate: Number,
//       amount: Number
//     }
//   ]
// });

// const Sales = mongoose.model("Sales", salesSchema);

// POST - Save sales entry
app.post("/api/sales", async (req, res) => {
  try {
    // Extract vr_no from the request body
    const { header_table } = req.body;
    
    if (!header_table || !header_table.vr_no) {
      return res.status(400).json({ 
        error: "vr_no is required in header_table" 
      });
    }

    // Check if vr_no already exists in the database
    const existingSale = await Sales.findOne({ 
      "header_table.vr_no": header_table.vr_no 
    });

    if (existingSale) {
      return res.status(409).json({ 
        message: "Sales entry with this vr_no already exists in the database",
        vr_no: header_table.vr_no,
        existing_sale_id: existingSale._id
      });
    }

    // If no duplicate found, create new sales entry
    const sale = new Sales(req.body);
    await sale.save();
    
    res.status(201).json({ 
      message: "Sales entry saved successfully!", 
      sale 
    });
    
  } catch (err) {
    // Handle mongoose validation errors specifically
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error", 
        details: err.message 
      });
    }
    
    // Handle mongoose duplicate key error (E11000)
    if (err.code === 11000) {
      return res.status(409).json({ 
        error: "Duplicate entry detected", 
        message: "Sales entry with this vr_no already exists in the database"
      });
    }
    
    res.status(500).json({ 
      error: "Internal server error", 
      message: err.message 
    });
  }
});
// GET - Fetch sales entry by vr_no
// app.get("/api/sales", async (req, res) => {
//   try {
//     const sales = await Sales.find();
//     res.status(200).json(Sales);
//       // "header_table.vr_no": req.params.vr_no
   

//     // if (!sale) return res.status(404).json({ message: "Not found" });
//     // res.json(sale);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });







// Server start
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));