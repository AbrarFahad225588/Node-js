const http = require("node:http");
const fs = require("node:fs");
const url = require("url");
const express = require("express");


const app = express()

app.get('/', (req, res) => {
    res.send("hi")
})
app.get('/about', (req, res) => {
    res.send("about")
})
app.get('/contact', (req, res) => {
    res.send("contact")
})
app.get('/end', (req, res) => {
    res.send("end")
})
app.get('/{*path}', (req, res) => {
    res.send("404 not found")
})
app.post("/form", (req, res) => {
    res.end("form submitted")
})
app.listen(8000, () => { console.log("start server") })


const hanndler = (req, res) => {
    if (req.url === '/favicon.ico') { res.end() };
    const myUrl = url.parse(req.url, true);
    const log = `${Date.now()}:${req?.url} new request received \n`;
    console.log(myUrl)
    fs.appendFile("log.txt", log, (err, data) => {
        switch (myUrl.pathname) {
            case "/":
                res.end("this is home page")
                break;
            case "/about":
                const search = myUrl.query.search_query;
                res.end(`this is abput page ${search}`)
                break;
            case "/contact":
                res.end("this is contact page")
                break;
            case "/end":
                res.end("this is end page")
                break;
            default:
                res.end("404 not found");
                break;

        }
    })

};
// const myserver=http.createServer(hanndler);
// myServer.listen(8000,()=>{console.log(url)});