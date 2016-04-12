var cheerio = require('cheerio');
var Crawler = require("simplecrawler");

var initialTopic = "SpaceX";
/*var blacklist = ["#", "/w/", "/static/", "/api/", "/beacon/", "File:",
                 "Wikipedia:", "Template:", "MediaWiki:", "Help:", "Special:",
                 "Category:", "Portal:", "Main_Page", "Talk:", "User:",
                 "User_talk:", "Template_talk:", "Module:"]; //useless special cases from wikipedia*/

var url = "/wiki/" + initialTopic;
var crawler = new Crawler("en.wikipedia.org", url, 80);

crawler.initialProtocol = "https";
crawler.maxDepth = 2; //reads only main article and links off of that
crawler.scanSubdomains = false;
crawler.stripWWWDomain = true;
crawler.stripQuerystring = true;

/*crawler.discoverResources = function(buffer, queueItem) {
  var $ = cheerio.load(buffer.toString("utf8"));
  $('.div-col.columns.column-count.column-count-2').prev().nextAll().remove(); //this removes the reference section after the main article

  var resources = $('a[href]').map(function() {
    var link = $(this).attr('href');
    if (!new RegExp(blacklist.join("|")).test(link)) { //this prevents the crawler from crawling irrelevant/useless pages
      return link;
    }
  }).get();

  return crawler.cleanExpandResources(resources, queueItem);
};*/

crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    var fetchedAddress = queueItem.url;
    //var $ = cheerio.load(responseBuffer.toString("utf8"));
    //$('.div-col.columns.column-count.column-count-2').nextAll().remove(); //removes reference section from article for ease of reading
    //var cleanedData = $('#mw-content-text').text() //assigning body of article to variable for testing/logging
    console.log(fetchedAddress); //logs the link of article that it is currently crawling
    //console.log(cleanedData);
});

crawler.on("crawlstart", function() {
  console.log("begin!");
});

crawler.on("complete", function() { //this event does not fire and the console hangs
  console.log("end!");
});

crawler.start(); //start crawler

/*var originalEmit = crawler.emit;
crawler.emit = function(evtName, queueItem) {
   crawler.queue.complete(function(err, completeCount) {
       if (err) {
           throw err;
       }

       crawler.queue.getLength(function(err, length) {
           if (err) {
               throw err;
           }

           console.log("fetched %d of %d — %d open requests, %d open listeners",
               completeCount,
               length,
               crawler._openRequests,
               crawler._openListeners);
       });
   });

   console.log(evtName, queueItem ? queueItem.url ? queueItem.url : queueItem : null);
   originalEmit.apply(crawler, arguments);
};*/
