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
const mkdirp = require('mkdirp');
const colors = require('colors');
const geoip = require('geoip-lite');
const spawn = require('child_process').spawn;
const getBrowserHistory = require('./historyQuery');

let timeOut = 1; // seg

getBrowserHistory((history) => {
  let routes = {};
  mkdirp('./routes', (err) => {
    err ? console.error(String(err).red) : console.log('-- ./route directory created'.green);
  });

  console.log('-- Starting traceroute with browser history...'.yellow);
  let tracerouteURL = (url) => {
    if (!routes[url]) {
      routes[url] = {
        times: 1,
        hops: []
      }

      let traceroute = spawn('traceroute', ['-I', url]);
      let finished = false;
      traceroute.stdout.on('data', (data) => {
        let hop = data.toString()
        let ip = hop.substring(hop.lastIndexOf("(") + 1, hop.lastIndexOf(")"));
        ip.length > 0 && routes[url].hops.push([ip, null, null]);
      });
      traceroute.stderr.on('data', (data) => {
        console.log(('-- ' + data.toString()).grey);
      });
      traceroute.on('exit', (code) => {
        if (!finished) {
          console.log(('-- ' + url + ' traceroute finished.').green);
          console.log(('-- Searching for ' + url + ' hops geoposition...').yellow);
          routes[url].hops.forEach((hop) => {
            // let ipGeoPosition = geoip.lookup(hop[0]);
            let ipGeoPosition = geoip.lookup('207.97.227.239');
            if (ipGeoPosition) {
              hop[1] = ipGeoPosition.ll[0],
              hop[2] = ipGeoPosition.ll[1]
            }
          });
          console.log(('-- ' + url + ' hops geoposition finished').green);

          fs.writeFile("./routes/routes.json", JSON.stringify(routes), (err) => {
            if (err) console.log(String(err).red);
            else console.log(`-- routes.json updated`.green);
          });
          finished = true;
        }
      });

      setTimeout(() => {
        if (!finished) {
          console.log(('-- Timeout for ' + url).magenta);
          finished = true;
          traceroute.kill();
        }
      }, timeOut * 1000);

    } else {
      console.log(('-- ' + url + ' already tracerouted.').blue);
      routes[url].times = routes[url].times + 1;
    }
  }

  //tracerouteURL('google.com');
  // Debug purpuses.
  let testUrls = history.filter((e, i) => {
    if (i < 1) {
      return e
    }
  });

  // Traceroute each url
  let removeHttp = new RegExp('https?://', 'i');
  testUrls.forEach((element) => {
    let url = element.url.replace(removeHttp, '').split('/')[0];
    tracerouteURL(url);
  })
})