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
    </head>
    <body>
      <h1>${username} traceroute history</h1>
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