/*
Traceroute the browser history 
*/

const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const colors = require('colors');
const geoip = require('geoip-lite');
const spawn = require('child_process').spawn;
const getBrowserHistory = require('./historyQuery');
const createVisualization = require('./../createVis/index');

let timeOut = 20; // seg

module.exports = (startDate, endDate) => {

  getBrowserHistory((history) => {
    let routes = {};
    let queu = [];

    mkdirp('./public/', (err) => {
      err ? console.error(String(err).red) : console.log('-- ./public directory created'.green);
    });

    console.log('-- Starting traceroute with browser history...'.yellow);
    let tracerouteURL = (url) => {
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
            let ipGeoPosition = geoip.lookup(hop[0]);
            if (ipGeoPosition) {
              hop[1] = ipGeoPosition.ll[0],
              hop[2] = ipGeoPosition.ll[1]
            }
          });
          console.log(('-- ' + url + ' hops geoposition finished').green);

          fs.writeFile("./public/routes.json", JSON.stringify(routes), (err) => {
            if (err) {
              console.log(String(err).red);
            } else {
              console.log(`-- routes.json updated`.green);
              queu.splice(queu.indexOf(url), 1);
              queu.length == 0 && createVisualization();
            }
          });
          finished = true;
        }
      });

      setTimeout(() => {
        if (!finished) {
          console.log(('-- Timeout for ' + url).magenta);
          finished = true;
          traceroute.kill();
          queu.splice(queu.indexOf(url), 1);
          queu.length == 0 && createVisualization();
        }
      }, timeOut * 1000);
    }

    //tracerouteURL('google.com');
    // Debug purpuses.
    let testUrls = history.filter((e, i) => {
      if (i < 40) {
        return e
      }
    });
    history = testUrls;
    // Finish debug

    // Traceroute each url
    let removeHttp = new RegExp('https?://', 'i');
    history.forEach((element, index) => {
      let url = element.url.replace(removeHttp, '').split('/')[0];
      if (!routes[url]) {
        queu.push(url)
        tracerouteURL(url);
      } else {
        console.log(('-- ' + url + ' already tracerouted.').blue);
        routes[url].times = routes[url].times + 1;
      }
    })

  })


}