// const Sales=require("./details.model");

// const getAllDetails=async(req,res)=>{
//     try{
//         const details=await Sales.find();
//         res.status(200).json(details)

//     }catch(error){
//         console.error("error fetching books",error);
//         res.status(500).send({message:"failed to fetch details"})
//     }
// }
// module.exports={getAllDetails}
const Sales = require("./details.model");

const getAllDetails = async (req, res) => {
  try {
    const details = await Sales.find();
    console.log(details);
    
    res.status(200).json(details);
    
    
  } catch (error) {
    console.error("Error fetching details:", error);
    return res.status(500).json({ message: "Failed to fetch details" });
  }
};





module.exports = { getAllDetails};