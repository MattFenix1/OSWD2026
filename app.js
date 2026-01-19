const {timeStamp, error}=require("console");
const express=require("express");
const mongoose=require("mongoose");
require("dotenv").config();
const fs=require("fs");
const path=require("path");
const app=express();
const port=process.env.PORT || 3000;
const MONGO_URI=process.env.MONGO_URI;

if(MONGO_URI){
    console.error("Missing connection data");
    process.exit(1);
}
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())

async function connectToMongo(){
    try{
        await mongoose.connect(MONGO_URI)
        console.log("Connected to Database");
    }catch(err){
        console.error("Database connection error: ",err.message);
        process.exit(1);
    }
}
app.get("/", (req,res)=>{
    res.send("It is running!!!")
});
app.get("/index",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"));
    console.log("Hit Index");
});
app.get("/todo",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","todo.html"));
    console.log("Hit Todo");
});
app.get("/read-todo",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","read-todo.html"));
    console.log("Hit Read-Todo");
});
app.get("/fakepage",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","fakepage"));
    console.log("Hit FakePage");
});

app.get("/api/data",(req,res)=>{
    res.join({
        message:"Hello from the server",
        timestamp:new Date(),
        items:["Node.js","Express","npm"]
    });
});
app.get("/api/userId",(req,res)=>{
    fs.readFile("todo.json","utf-8",(err,data)=>{
        if(err){
            res.status(500).json({error:"Failed to read data file"});
            return;
        }
        res.json(JSON.parse(data));
    });
});

const todo=new mongoose.Schema({},{strict:false})
const ToDoList=new mongoose.model("ToDoList",todo);
app.get("/api/todo",async(req,res)=>{
    const data=await ToDoList.find({});
    console.log(data);
    res.json(data);
});
app.get("/api/todo/:todolist",async(req,res)=>{
    console.log(req.params.todolist);
    const tlist=req.params.todolist;
    const TodoList=await ToDoList.findOne({todolist:tlist});
    console.log(TodoList);
    res.json(todolist);
});
connectToMongo().then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    });
})