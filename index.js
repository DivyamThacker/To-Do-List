import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

const date = new Date();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');



let month = date.getMonth() + 1;
const _date = date.getDate();
let day = date.getDay();

switch(month) {
    case 1:
        month = 'January';
        break;
    case 2:
        month = 'February';
        break;
    case 3:
        month = 'March';
        break;
    case 4:
        month = 'April';
        break;
    case 5:
        month = 'May';
        break;
    case 6:
        month = 'June';
        break;
    case 7:
        month = 'July';
        break;
    case 8:
        month = 'August';
        break;
    case 9:
        month = 'September';
        break;
    case 10:
        month = 'October';
        break;
    case 11:
        month = 'November';
        break;
    case 12:
        month = 'December';
        break;
}

switch(day) {
    case 0:
        day = 'Sunday';
        break;
    case 1:
        day = 'Monday';
        break;
    case 2:
        day = 'Tuesday';
        break;
    case 3:
        month = 'Wednesday';
        break;
    case 4:
        day = 'Thursday';
        break;
    case 5:
        day = 'Friday';
        break;
    case 6:
        day = 'Saturday';
        break;
}

const arr=[];
const Work_arr=[];

app.get("/", (req,res)=>{
    // console.log(req.body);
    res.render("index.ejs", {day : day, date : _date, month: month ,array : arr, size: arr.length});
});

app.get("/work", (req,res)=>{
    // console.log(req.body);
    res.render("windex.ejs",{warray: Work_arr, size: Work_arr.length});
});


app.post("/", (req,res)=>{
    // res.render("index.ejs", {day : day, date : _date, month: month });
    res.send("oi");
    console.log("chutiya");
});

app.post("/work", (req,res)=>{
    res.send("oi");
    console.log(req.body);
    // let string=  req.body.newItem;
    // Work_arr.push(string);
    // let size= arr.length;
    // res.render("windex.ejs", {Work_array : Work_arr, W_size : size});
});

app.listen(port, ()=>{
    console.log(`listening on port: ${port}`);
});

