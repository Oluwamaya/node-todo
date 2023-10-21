const express = require("express")
require("dotenv").config();
const app = express()
const ejs = require("ejs")
const mongoose =  require("mongoose")
app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
let arr = []

const todoSchema = new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    }
})
const todoModel = mongoose.models.todo_tbs || mongoose.model("todo_tbs", todoSchema)
app.get("/", (request, response)=>{
    // response.send({hello:"hello world"})
    // response.sendFile(__dirname + "/index.html")
    response.render("index.ejs", {name:"sam", age:25, gender:"male"})
})

app.get("/todo", async(req, res)=>{
    const arr = await todoModel.find({})
    res.render("todo", {arr})
})
app.post("/postToTodo",async(req,res)=>{
    // console.log("posted to do")
    // console.log(req.body)
    // arr.push(req.body)
    // console.log(arr)
    const {title, description}= req.body
    const todo = await todoModel.create({title, description})
    if(todo){

        res.redirect("/todo")
    }else{
        res.status(500).send({message: "failed to create todo"})
    }
})
app.post("/deletepost", async(req, res)=>{
    const {id} = req.body
    const deleted = await todoModel.findByIdAndDelete(id)
    console.log(deleted)
    res.redirect("./todo")
})
let id;
app.get("/todo/:id", async(req,res)=>{
    id = req.params.id
    console.log(id)
    const values = await todoModel.findById(id)
    console.log(values)
    res.render("edit.ejs", {values, id})
})
// app.post("/editbtn", (req,res)=>{
//     console.log(req.body)
//     const {edit } = req.body
//     console.log(edit)
//     const ar = arr[edit]
//     console.log(ar)
//     res.render("edit.ejs", {ar, edit})
// })
app.post("/edit", async(req, res)=>{
    console.log(req.body)
    const {title, description, id} = req.body
    const edited = await todoModel.findByIdAndUpdate({_id: id}, {$set: {title, description}})
    res.redirect("/todo")
    
})

// app.get("/todo", (req,res)=>{
//     res.sendFile(__dirname + "/index.html")
// })



const connect = () =>{
    mongoose.set("strictQuery",false)
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("connected to mongodb")
    
    }).catch((error)=>{
        console.log(error)})
    
 }
 connect()
app.listen(process.env.PORT, ()=>{
    console.log(`started, ${process.env.PORT}`
    )
   }) 