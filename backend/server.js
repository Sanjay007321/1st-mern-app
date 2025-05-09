const express = require("express");
const mongo = require("mongoose")
const cors = require("cors")
const app = express() //server
//json mware
app.use(cors({
    origin: "https://onest-mern-app-frontend.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json())
//var todo = []; //post data
//DB connect
mongo.connect("mongodb+srv://saniay007aj:PRlr7P4zjqbmGVgL@cluster0.4fhgz1q.mongodb.net/").then(()=>{
    console.log("Mdb CONNECTED")
}).catch(()=>{console.log("ERROR")})
//schema
const bbmsSchema = new mongo.Schema({
    name: {required:true,
        type:String},
    blood:{required:true,
        type:String},
    contact:{required:true,
        type:String}
    })
//MODEL
const User = mongo.model("bbm",bbmsSchema)
//send || create
app.post('/bbm',async(req,res)=>{
    try{
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    }
    catch(error){ 
        console.log(error)
        res.status(400).json({message:error.message}); 
    }
})
//receive || read
app.get('/bbm',async(req,res)=>{
    try {
        const data = await User.find()
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message}); 
    }
})
//update 
app.put('/bbm/:id',async(req,res)=>{
   try {
    const id = req.params.id;
    const update = await User.findByIdAndUpdate(id,req.body,{new:true})
    if(!update){
        return res.status(404).json({message:"To do not found"})
    }
    console.log("Updated")
    res.json(update)
   } catch (error) {
    console.log('error')
    res.status(500).json({message:error.message}); 
   }
})
//delete
app.delete('/bbm/:id',async(req,res)=>{
    try {
    const id = req.params.id;
    await User.findByIdAndDelete(id)
    res.status(204).json({ message: "Deleted successfully" });
    } catch (error) {
        console.log(error)
       res.status(500).json({message:error.message}); 
    }
})
const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`success is listening to ${port}`)
})

