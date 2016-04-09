var cheerio = require('cheerio');
var Crawler = require("simplecrawler");

//var initialTopic = "Tesla_Motors";
var initialTopic = "SpaceX";
var blacklist = ["File:", "#", "/w/", "/static/", "Wikipedia:", "Template:", "MediaWiki:", "Help:", "Special:", "Category:", "Portal:", "Main_Page", "Talk:", "User:", "User_talk:", "Template_talk:", "Module:", "/api/", "/beacon/"]

var crawler = new Crawler("en.wikipedia.org", "/wiki/" + initialTopic);
crawler.initialProtocol = "https";
crawler.maxDepth = 3;
crawler.scanSubdomains = false;
crawler.stripWWWDomain = true;
crawler.stripQuerystring = true;

crawler.discoverResources = function(buffer, queue) {
  var $ = cheerio.load(buffer.toString("utf8"));
  return $('a[href]').map(function() {
    var link = $(this).attr('href');
    if (!new RegExp(blacklist.join("|")).test(link)) {
      return link;
    }
  }).get()
};

crawler.on("fetchcomplete", function(queue, data, res) {
    $ = cheerio.load(data);
    var fetchedAddress = queue.url;
    var fetchedData = $().text();
    console.log("%s", fetchedAddress);
    console.log("\n");
    console.log("%s", data);
    console.log("-------------------------");

    //console.log("I just received %s (%d bytes)", queue.url, data.length);
    //console.log("It was a resource of type %s", res.headers['content-type']);
});

crawler.start();
