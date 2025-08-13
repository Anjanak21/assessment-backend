// const mongoose=require('mongoose');
// const salesSchema=new mongoose.Schema({
//      header_table: {
//        vr_no: {type:String,unique: true,required: true},
//        vr_date: Date,
//        ac_name: String,
//        ac_amt: Number,
//        status: String
//      },
//      details_table: [
//        {
//          sr_no: Number,
//          item_code: String,
//          item_name: String,
//          description: String,
//          qty: Number,
//          rate: Number,
//          amount: Number
//        }
//      ]
//    });

   
    
//    module.exports=mongoose.model("Sales",salesSchema,"sales");
const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  header_table: {
    vr_no: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    vr_date: {
      type: Date,
      default: Date.now
    },
    ac_name: String,
    ac_amt: Number,
    status: {
      type: String,
      default: 'active'
    }
  },
  details_table: [{
    sr_no: Number,
    item_code:{ type:String,
      required: true,
      trim: true
    },
    item_name: String,
    description: String,
    qty: {
      type: Number,
      min:1,
      default: 0
    },
    rate: {
      type: Number,
      min:1,
      default: 0
    },
    amount: {
      type: Number,
      min:1,
      default: 0
    }
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});


salesSchema.index({ "header_table.vr_no": 1 });
salesSchema.pre('validate', function (next) {
  const itemCodes = this.details_table.map(item => item.item_code);
  const hasDuplicate = new Set(itemCodes).size !== itemCodes.length;

  if (hasDuplicate) {
    return next(new Error("Duplicate item codes are not allowed in details_table"));
  }
  next();
});


module.exports = mongoose.model("Sales", salesSchema, "sales");