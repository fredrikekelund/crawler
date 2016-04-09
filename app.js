var cheerio = require('cheerio');
var Crawler = require("simplecrawler");

var initialTopic = "SpaceX";
var blacklist = ["#", "/w/", "/static/", "/api/", "/beacon/", "File:",
                 "Wikipedia:", "Template:", "MediaWiki:", "Help:", "Special:",
                 "Category:", "Portal:", "Main_Page", "Talk:", "User:",
                 "User_talk:", "Template_talk:", "Module:"] //useless special cases from wikipedia

var crawler = new Crawler("en.wikipedia.org", "/wiki/" + initialTopic, 80);

crawler.initialProtocol = "https";
crawler.maxDepth = 2; //reads only main article and links off of that
crawler.scanSubdomains = false;
crawler.stripWWWDomain = true;
crawler.stripQuerystring = true;

crawler.discoverResources = function(buffer, queue) {
  var $ = cheerio.load(buffer.toString("utf8"));
  $('.div-col.columns.column-count.column-count-2').prev().nextAll().remove(); //this removes the reference section after the main article
  return $('a[href]').map(function() {
    var link = $(this).attr('href');
    if (!new RegExp(blacklist.join("|")).test(link)) { //this prevents the crawler from crawling irrelevant/useless pages
      return link;
    }
  }).get()
};

crawler.on("fetchcomplete", function(queue, data, res) {
    var fetchedAddress = queue.url;
    var $ = cheerio.load(data);
    $('.div-col.columns.column-count.column-count-2').nextAll().remove(); //removes reference section from article for ease of reading
    var cleanedData = $('#mw-content-text').text() //assigning body of article to variable for testing/logging
    console.log(fetchedAddress); //logs the link of article that it is currently crawling
    //console.log(cleanedData);
});

crawler.start(); //start crawler

crawler.on("crawlstart", function() {
  console.log("begin!"); //this shows up in console right before the first link
});

crawler.on("complete", function() { //this event does not fire and the console hangs
  console.log("end!");
});
