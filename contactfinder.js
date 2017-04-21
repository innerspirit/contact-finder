const request = require('superagent');
const cheerio = require('cheerio')
let URL = process.argv[2];

function checkContact(val) {
    request
    .get(val)
    .end(function(err, res) {
        if (err !== null && err.response === undefined) {
          console.log('Wrong URL');
          return;
        };
      const $ = cheerio.load(res.text);
        if ($("a[href*='contact']").length !== 0) {
          console.log($("a[href*='contact']")[0].attribs.href);
        } else {
          console.log("There is no contact link");
        };
    });
};
checkContact(URL);
