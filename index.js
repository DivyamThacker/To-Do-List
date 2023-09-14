import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import _ from "lodash";

dotenv.config();
const app = express();


const date = new Date();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


mongoose.connect(process.env.DATABASE_URL,
   { useNewUrlParser: true, useUnifiedTopology: true})
   .then(function(){
        console.log("Mongo DB atlas is connected.");
 })
 .catch((error) => {
    console.log(error);
  });

    const itemsSchema = new mongoose.Schema({
        name: String
      });

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name:"you are great"
});
const item2 = new Item({
    name:"you are greater"
});
const item3 = new Item({
    name:"you are greatest"
});

const defaultItems = [item1,item2,item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}; 

const List = mongoose.model("List", listSchema);


//mongodb ends here

// let month = date.getMonth() + 1;
// const _date = date.getDate();
// let day = date.getDay();

// switch(month) {
//     case 1:
//         month = 'January';
//         break;
//     case 2:
//         month = 'February';
//         break;
//     case 3:
//         month = 'March';
//         break;
//     case 4:
//         month = 'April';
//         break;
//     case 5:
//         month = 'May';
//         break;
//     case 6:
//         month = 'June';
//         break;
//     case 7:
//         month = 'July';
//         break;
//     case 8:
//         month = 'August';
//         break;
//     case 9:
//         month = 'September';
//         break;
//     case 10:
//         month = 'October';
//         break;
//     case 11:
//         month = 'November';
//         break;
//     case 12:
//         month = 'December';
//         break;
// }

// switch(day) {
//     case 0:
//         day = 'Sunday';
//         break;
//     case 1:
//         day = 'Monday';
//         break;
//     case 2:
//         day = 'Tuesday';
//         break;
//     case 3:
//         month = 'Wednesday';
//         break;
//     case 4:
//         day = 'Thursday';
//         break;
//     case 5:
//         day = 'Friday';
//         break;
//     case 6:
//         day = 'Saturday';
//         break;
// }

// const arr=[];
// const Work_arr=[];

app.get("/", (req,res)=>{

        Item.find({})
        .then(function(foundItems){
            if (foundItems.length===0)
            {
                Item.insertMany(defaultItems)
                .then(function(){
                    console.log("Successfully saved into our DB.");
                })
                .catch(function(err){
                    console.log(err);
                }); 
                res.redirect("/");
            }
            else{
                // console.log(foundItems);
                res.render("index.ejs", {listTitle: "Today",newListItems: foundItems});
            }
        })
        .catch(function(err){
            console.log("cannot find requested items");
        });
    });

app.get("/:customListName", (req,res)=>{

    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name:customListName})
    .then(function(foundList){
        if (!foundList)
        {
            //create list
            const list =new List({
                name : customListName,
                items: defaultItems
            });
            list.save();
            res.redirect("/"+customListName);
        }
        else {
            //show existing list
            res.render("index.ejs", {listTitle: foundList.name, newListItems: foundList.items});
        }
    })
    .catch(function(err){
        console.log(err);
    });

});

app.post("/", (req,res)=>{
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    });
    if (listName==="Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listName})
        .then(function(foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete", (req,res)=>{
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName=== "Today"){
        Item.findByIdAndRemove(checkedItemId)
        .then(function(){
            console.log("successfully removed from Today");
            res.redirect("/");
        })

        .catch(function(err){
            console.log(err);
        });
    }

    else{
        List.findOneAndUpdate({name:listName}, {$pull : {items: {_id : checkedItemId}}})
        .then(function(foundList){  
            
            res.redirect("/"+listName);
        });
    }

});


app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
