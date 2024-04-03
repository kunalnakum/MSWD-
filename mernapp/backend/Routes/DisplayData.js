const express = require('express')
const router = express.Router()

router.post('/productData',(req,res)=>{
    try {
        // console.log(global.products)
        res.send([global.products,global.productsCategory])
    } catch (error) {
        console.error(error.message);
        res.send("Server Error")
    }
})

module.exports = router;