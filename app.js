//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



   mongoose.connect("mongodb+srv://sheikahamed134:sheikahamed@cluster0.oxaftjj.mongodb.net/todolistDB?retryWrites=true&w=majority");
   

  const todoschema=new mongoose.Schema({
    name: String
  });
const todo=mongoose.model("todo", todoschema);

const item1=new todo({
  name: "Welcome to your Todo List"
});
const item2=new todo({
  name: "Click here to Add new Item"
});
const item3=new todo({
  name: "Click here to delete new Item"
});
  var Items=[item1,item2,item3];
const itemschema={
  name: String,
  items:[todoschema]
};
const userItem=mongoose.model('useritem',itemschema);


 
 console.log("successfull");
 





app.get("/",  async (req, res)=> {

  

const now=date.getDate();


const find= await todo.find({});
 if(find.length===0){
  await todo.insertMany(Items);
  res.redirect("/");
 }
 else{
  res.render("list", {listTitle: now, newListItems: find});
 }
 
  

});

app.post("/", async (req, res)=>{

  const itemName= req.body.newItem;
  
 

  const item=new todo({
    name: itemName
  });
  item.save();
  res.redirect("/");

});

  app.post("/delete", async (req,res)=>{
const checkedid=req.body.checkbox;
await todo.findByIdAndRemove(checkedid);
res.redirect("/");

})

app.get("/:topic", async function(req,res){

  const topic=req.params.topic;
 const findone= await userItem.findOne({name:topic});

 if(!findone){
  //create a new list
  const item=new userItem({
    name: topic,
    items: Items
  });
  
item.save();
res.redirect("/"+ topic);
 }
 else{
  res.render("list", {listTitle: findone.name, newListItems: findone})
 }


});

app.get("/about", function(req, res){
  res.render("about");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
