/*
Visualize the history traceroute using the routes.json file
*/

const colors = require('colors');
const createHTML = require('./createHTML');
const fs = require('fs-extra')
const browserify = require('browserify')();
const liveServer = require("live-server");

const params = {
  port: 8181,
  host: "0.0.0.0",
  root: "./public",
};

module.exports = () => {
  console.log(`-- Creating traceroute visualization...`.grey);

  createHTML();

  console.log(`-- Bundling js file...`.grey);
  // let bundleFs = fs.createWriteStream('./public/bundle.js');
  // browserify.add('./browser/main.js');
  // browserify.bundle().pipe(bundleFs);

  // bundleFs.on('finish', () => {
  //   console.log(`-- bundle.js created. Launching server. ==> BAM!`.green);
  //   liveServer.start(params);
  // });
}