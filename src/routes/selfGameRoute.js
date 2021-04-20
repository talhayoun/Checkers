const express = require("express");
const path = require("path");
const router = new express.Router()

router.get("/self", async(req, res)=>{
    res.sendFile(path.join(__dirname, "../../public/damka.html"))
})

module.exports = router;