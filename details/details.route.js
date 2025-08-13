const express = require("express");
const router = express.Router();
const { getAllDetails} = require("./detailscontroller");

// GET all details
router.get("/", getAllDetails);


module.exports = router;