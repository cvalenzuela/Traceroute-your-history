/*
Query Chrome's history db using sqlite3
References: 
  - https://productforums.google.com/forum/#!topic/chrome/WiBZ3e_sEAM
  - https://www.lowmanio.co.uk/blog/entries/how-google-chrome-stores-web-history/?printerfriendly=true
  - https://stackoverflow.com/questions/2562092/how-to-access-google-chrome-browser-history-programmatically-on-local-machine
*/

const fs = require('fs-extra')
const os = require('os');
const sqlite3 = require('sqlite3').verbose();
const colors = require('colors');
const mkdirp = require('mkdirp');

const originalDbPath = os.homedir() + '/Library/Application Support/Google/Chrome/Default/History';
const dbPath = './getData/history/History';
let query = `
SELECT datetime(last_visit_time/1000000-11644473600,'unixepoch') as time, url
FROM urls
ORDER BY last_visit_time DESC`;

module.exports = (callback) => {
  let data;

  if (fs.existsSync(originalDbPath)) {
    // Copy file so we don't mess up with the original one
    console.log(`\n-- Found Chrome's browser history`.green);
    mkdirp('./getData/history', (err) => {
      err ? console.error(String(err).red) : console.log('-- ./getData/history directory created'.green);
      fs.copy(originalDbPath, dbPath)
        .then(() => readDb())
        .catch(err => console.error(err))

      let readDb = () => {
        console.log(`-- Browser history copied`.green);
        let db = new sqlite3.Database(dbPath);

        db.serialize(() => {
          db.all(query, (err, history) => {
            if (!history) {
              console.log(`-- You need to close Chrome first! Try again.\n`.red);
            } else {
              data = history;
              console.log(`-- Creating history.json...`.grey);
              fs.writeFile("./getData/history/history.json", JSON.stringify(history), (err) => {
                if (err) console.log(String(err).red);
                else console.log(`-- History.json created`.green);
                callback(data);
              });

            }
          });
        });
        db.close();
      }
    });
  } else {
    console.log(`Sorry, I couldn't find your Chrome browser history.`.red);
    console.log(`\nMaybe your Chrome version is storing it somewhere else.\nI'm looking at ${dbPath}\nCan you check where else could it be?\nMaybe this helps: https://stackoverflow.com/questions/8936878/where-does-chrome-save-its-sqlite-database-to`.yellow);
    console.log(`\nOnce you have it, change the dbPath variable in the historyQuery.js file and try again :)`.green);
    callback(data);
  }

}