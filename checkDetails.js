const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/yourdbname"; // change to your db name

// Define your schema (same as in your model)
const detailsSchema = new mongoose.Schema({
  header_table: {
    vr_no: String,
    vr_date: Date,
    ac_name: String,
    ac_amt: Number,
    status: String
  },
  details_table: [
    {
      sr_no: Number,
      item_code: String,
      item_name: String,
      description: String,
      qty: Number,
      rate: Number,
      amount: Number
    }
  ]
});

const Details = mongoose.model("Details", detailsSchema);

async function checkData() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB Connected");

    const data = await Details.find({});
    console.log("📦 Found records:", JSON.stringify(data, null, 2));

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error:", err);
    mongoose.connection.close();
  }
}

checkData();
