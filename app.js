var cheerio = require('cheerio');
var Crawler = require("simplecrawler");

var initialTopic = "SpaceX";
var blacklist = ["#", "/w/", "/static/", "/api/", "/beacon/", "File:",
                 "Wikipedia:", "Template:", "MediaWiki:", "Help:", "Special:",
                 "Category:", "Portal:", "Main_Page", "Talk:", "User:",
                 "User_talk:", "Template_talk:", "Module:"]

var crawler = new Crawler("en.wikipedia.org", "/wiki/" + initialTopic, 80);

crawler.initialProtocol = "https";
crawler.maxDepth = 2;
crawler.scanSubdomains = false;
crawler.stripWWWDomain = true;
crawler.stripQuerystring = true;

crawler.discoverResources = function(buffer, queue) {
  var $ = cheerio.load(buffer.toString("utf8"));
  $('.div-col.columns.column-count.column-count-2').prev().nextAll().remove();
  return $('a[href]').map(function() {
    var link = $(this).attr('href');
    if (!new RegExp(blacklist.join("|")).test(link)) {
      return link;
    }
  }).get()
};

crawler.on("fetchcomplete", function(queue, data, res) {
    var fetchedAddress = queue.url;
    var $ = cheerio.load(data);
    $('.div-col.columns.column-count.column-count-2').nextAll().remove();
    var cleanedData = $('#mw-content-text').text()
    console.log(fetchedAddress);
    //console.log(cleanedData);
});

crawler.start();

crawler.on("crawlstart", function() {
  console.log("begin!");
});

crawler.on("complete", function() { //this event does not fire and the console hangs
  console.log("end!");
});
