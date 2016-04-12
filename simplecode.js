var cheerio = require('cheerio');
var Crawler = require("simplecrawler");

var initialTopic = "SpaceX";
var url = "/wiki/" + initialTopic;
var crawler = new Crawler("en.wikipedia.org", url, 80);

crawler.initialProtocol = "https";
crawler.maxDepth = 2; //reads only main article and links off of that
crawler.scanSubdomains = false;
crawler.stripWWWDomain = true;
crawler.stripQuerystring = true;

crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    var fetchedAddress = queueItem.url;
    console.log(fetchedAddress); //logs the link of article that it is currently crawling
});

crawler.on("crawlstart", function() {
  console.log("begin!");
});

crawler.on("complete", function() { //this event does not fire and the console hangs
  console.log("end!");
});

crawler.start(); //start crawler
