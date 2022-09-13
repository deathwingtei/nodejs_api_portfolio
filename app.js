const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const mongodb_data = require("./util/mongodb_data");


app.use(express.static(path.join(__dirname,'public')));

const errorController = require('./controllers/error');
const mainRouter = require('./routes/main');
const apiRouter = require('./routes/api');
app.use(cors({
    origin: true
}));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true})); //endcode for post data
app.use(express.json());
// app.use(express.multipart());


app.use(cookieParser());
app.use(session({secret:"dgsession_devuwebport",resave:false,saveUninitialized:true,cookie: { secure: false }}));

app.get('/favicon.ico', function(req, res) { 
    res.status(204);
    res.end();    
});

app.use('/',mainRouter);
app.use('/api',apiRouter);

app.use(errorController.get404);

const connectDatabase = async () => {
    try {
        await mongoose.connect(mongodb_data.url, mongodb_data.options);
        console.log("connected to database");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

connectDatabase();

app.listen(3000,()=>{
    console.log("Server Starting Port : 3000");
});