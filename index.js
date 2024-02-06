
const fs= require("fs");
const http = require("http");

const path = require("path");
const express = require("express");
const multer = require("multer");
const app = express();
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, "./uploads");
    },
    filename: function(req, file, cb){
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.get("/", (req, res)=>{
    return res.render("homepage");
});
app.post('/upload', upload.single('profileImage'), (req, res)=>{
    console.log(req.body);
    console.log(req.file);
    return res.redirect("/");
});
function readFile(res, fileName, contentType){
    fs.readFile("template/"+ fileName, (error, data)=>{
        if (error) throw error;
        res.writeHead(200, {"Content-type": contentType});
        res.write(data);
        res.end();
    });
}
const myServer = http.createServer((req, res)=>{
    let fileName = req.url;
    switch (fileName){
        case "/":
        case "/home":
            readFile(res, "index.html", "text/html");
            break
        case "/about":
            readFile(res, "about.html", "text/html");
            break
        case "/contact":
            readFile(res, "contact.html", "text/html");
            break 
        case "/css/style.css":
            readFile(res, "css/style.css", "text/css"); // When calling CSS file
            break;
        case "/file-write":
            fs.writeFileSync("./demo.txt", "hello world");
        default:
            readFile(res, "error.html", "text/html");
    }


});

myServer.listen(5500, ()=>console.log("Server Started!"));

