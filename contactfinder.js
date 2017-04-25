const request = require('superagent');
var Promise = this.Promise || require('promise');
var agent = require('superagent-promise')(request, Promise);
const cheerio = require('cheerio');
var whois = require('whois-ux');
let URL = process.argv[2];

function checkContact(val) {
  Promise.all([
    getDNSEmail(val),
    getHTMLContacts(val)
  ]).then(function (data) {
    console.log(data);
  })
}

function getHTMLContacts(val) {
  return new Promise(function (accept, reject) {
    agent
      .get(val)
      .end()
      .then(function(res) {
        const $ = cheerio.load(res.text);
        accept({
          'contactUrl': getContact($),
          'emailFromHtml': getEmail(res.text)
        });
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

function getEmail(val) {
  let email = /[\w-]+@([\w-]+\.)+[\w-]+/.exec(val);
  if (email !== null && email !== 0) {
    return email[0];
  } else {
    return null;
  }
}

function getContact($) {
  if ($("a[href*='contact']").length !== 0) {
    return $("a[href*='contact']")[0].attribs.href;
  } else {
    return null;
  }
}

function getDNSEmail(url) {
  return new Promise(function (accept, reject) {
    whois.whois(url, function (err, data){
      accept({ 'emailFromDns': data['Registrant Email'] });
    });
  });
}

console.log(checkContact(URL));
