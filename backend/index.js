const port = 4000;
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//db connection with mongodb
mongoose.connect("mongodb+srv://avi19042004:Avi1904@cluster0.jargvng.mongodb.net/ecom");

//API create

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

//Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/Images',
    filename:(req,file,cb) => {
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//creating upload Endpoint for images
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res) => {
    res.json({
        success:1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

//create schema for product
const Product = mongoose.model("Product",{
    id:{
        type: Number,
        require:true,
    },
    name:{
        type: String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    }
})

app.post("/addproduct",async (req,res) => {
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1
    }else{
        id = 1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved")

    res.json({
        success:true,
        name:req.body.name,
    })


})

//api for deleting product
app.post("/removeproduct",async (req,res)=> {
    await Product.findOneAndDelete({id:req.body.id})
    console.log("Removed")
    res.json({
        success:true,
        name:req.body.name,
    })
})

//api to get all products in database
app.get("/allproduct",async (req,res) => {
    let products = await Product.find({});
    console.log("All Product Fatched");
    res.send(products)
})

//user schema creating

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
}) 

//Creating endpoint for registering user

app.post('/signup',async (req,res) => {

    let check = await Users.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false,error:"existing user found with this email id"})
    }

    let cart = {};
    for(let i=0; i<300;i++){
        cart[i]=0;
    }

    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//endpoint for user login
app.post('/login',async(req,res) => {
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom')
            res.json({success:true,token});
        }else{
            res.json({success:false,error:"wrong password"})
        } 
    }else{
        res.json({success:false,error:"Wrong Email Id"})
    }
})



//api to get new collection
app.get('/newcollection',async (req,res) => {
    let product = await Product.find({});
    let newcollection = product.slice(1).slice(-8)
    console.log("New Collection Fatched")
    res.send(newcollection)
})

//api for populer
app.get('/popular', async(req,res) => {
    let product = await Product.find({});
    let popular = product.slice(1,4);
    console.log("populer fatcherd")
    res.send(popular) 
})

//creating middelware to fatch users
const fetchuser = async (req,res,next) => {
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Plese authenticate using valid user"})
    }else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({error: 'Plese authenticate using valid'})
        }
    }
}

//api for add to cart
app.post('/addtocart', fetchuser, async(req,res) => {
    console.log("added",req.body.itemId)
    let userdata = await Users.findOne({_id:req.user.id})
    userdata.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData})
    res.send("Addeds")
})

//endpoint to remove cart data
app.post('/removefromcart',fetchuser,async(req,res) => {
    console.log("removed",req.body.itemId)
    let userdata = await Users.findOne({_id:req.user.id})
    if(req.body.itemId> 1){
        userdata.cartData[req.body.itemId] -= 1;
        await Users.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData})
        res.send("Addeds")
    }
})

//endpoint to get cart data
app.post('/getcart', fetchuser, async(req,res) => {
    console.log("get cart")
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

//schema for orders
const CheckoutSchema = mongoose.model("CheckoutSchema",{
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
        // required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

})

//api for checkout
app.post("/checkout", async(req,res) => {
    const order = new CheckoutSchema({
        name:req.body.name,
        address:req.body.address,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber, 
    })

    await order.save()

    res.json({
        success:true,
        name:req.body.name,
    })

})


//to show server is running
app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port"+port)
    }else{
        console.log("Error:"+error)
    }
})