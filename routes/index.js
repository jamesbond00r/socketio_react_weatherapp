// require express and express router
const express = require("express");
const router = express.Router();

// GET call to home page
router.get("/", (req, res) =>{
	res.send({ resonse: "I am alive" }).status(200);
});


//EXPORT ROUTER TO OTHER FILES
module.exports = router;