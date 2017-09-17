/*
======
Traceroute script to visualize browser history of Chrome

Assignment for Understanding Networks - Tom Igoe
Fall 2017 @ NYU ITP

By Cristobal Valenzuela
cvalenzuela@nyu.edu
======
*/

const fs = require('fs-extra');
const readline = require('readline');
const colors = require('colors');
const getData = require('./getData/index');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
===============================
Traceroute your browser history
===============================
 `.cyan)

let getDates = () => {
  rl.question('Do you want to traceroute ' + 'a'.underline.blue + 'll' +  ' your browser history or a ' +  's'.underline.blue + 'pecific' + ' time period?' + ' (a/s): '.blue, (all) => {
    if (all == 'a') {
      rl.close();
      getData(null, null);
    } else {
      rl.question('Start date of browser history to traceroute?' + ' (ie: 2016-09-23): '.blue, (start) => {
        if (isValidDate(start)) {
          rl.question('Until when?' + ' (ie: 2017-07-20): '.blue, (end) => {
            if (isValidDate(end)) {
              rl.close();
              getData(start, end);
            } else {
              console.log('Not a valid date'.red);
              getDates()
            }
          })
        } else {
          console.log('Not a valid date'.red);
          getDates()
        }
      });
    }
  })
}

let isValidDate = (dateString) => {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  var d = new Date(dateString);
  if (!d.getTime()) return false; // Invalid date (or this could be epoch)
  return d.toISOString().slice(0, 10) === dateString;
}

// Start
getDates();