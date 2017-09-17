/*
Creates an HTML File
*/

const fs = require('fs-extra');
const username = require('username');
const colors = require('colors');

module.exports = () => {
  username().then(username => {

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>${username} traceroute history</title>
      <style>
      * {
        margin: 0px;
        padding: 0px;
        overflow: hidden;
        font-family: 'Helvetica', Arial, sans-serif;
      }
    
      #input {
        position: absolute;
        top: 1vh;
        right: 2vw;
        z-index: 99;
      }
    
      input {
        padding: 4px;
      }
      input:focus{
        outline: none;
      }
      button {
        padding: 8px;
        margin-left: 10px;
        border: 1px solid white;
        color: white;
        cursor: pointer;
        background: #030315;
      }
      button:focus{
        outline: none;
      }
    
      </style>
    </head>
    
    <body>
      <div id="input">
        <input type="text" name="url" id="inputValue" placeholder="example.com" onkeydown = "event.keyCode == 13 && document.getElementById('btnTraceroute').click()">
        <button onclick="drawRoutes()" id="btnTraceroute">Traceroute</button>
      </div>
      <script src="bundle.js"></script>
    </body>
    
    </html>
     
    `
    fs.writeFile("./public/index.html", html, (err) => {
      if (err) console.log(String(err));
      else console.log(`-- index.html created.`.green);
    });
  });
}