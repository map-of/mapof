var document = SpreadsheetApp.openById(
  '1jvQsbDus_irRz0lnUlfahZZy9ZOpK0VA5lSwt6Gt-ks'
);

// var allGenres = getAllGenres();

// function getAllGenres() {
//   var sheet = document.getSheetByName(
//     "genres (nein das funktioniert noch nicht :D)"
//   );
//   var range = sheet.getDataRange();
//   var data = range.getValues();
//   var headings = data[0];
//   const genres = [];

//   for (var i = 1; i < data.length; i++) {
//     var genre = {};
//     for (var j = 0; j < headings.length; j++) {
//       genre[headings[j].toString()] = data[i][j];
//     }

//     genres.push(genre);
//   }

//   return genres;
// }

function ChunkyCache(cache, chunkSize) {
  return {
    put: function (key, value, timeout) {
      var json = JSON.stringify(value);
      var cSize = Math.floor(chunkSize / 2);
      var chunks = [];
      var index = 0;
      while (index < json.length) {
        cKey = key + '_' + index;
        chunks.push(cKey);
        cache.put(cKey, json.substr(index, cSize), timeout + 5);
        index += cSize;
      }

      var superBlk = {
        chunkSize: chunkSize,
        chunks: chunks,
        length: json.length
      };
      cache.put(key, JSON.stringify(superBlk), timeout);
    },
    get: function (key) {
      var superBlkCache = cache.get(key);
      if (superBlkCache != null) {
        var superBlk = JSON.parse(superBlkCache);
        chunks = superBlk.chunks.map(function (cKey) {
          return cache.get(cKey);
        });
        if (
          chunks.every(function (c) {
            return c != null;
          })
        ) {
          return JSON.parse(chunks.join(''));
        }
      }
    }
  };
}

function genreQuery(genre) {
  var cache = ChunkyCache(CacheService.getScriptCache(), 1024 * 90);

  var cached = cache.get(genre);
  if (cached != null) {
    return cached;
  }

  var sheet = document.getSheetByName(genre);
  var range = sheet.getDataRange();
  var data = range.getValues();
  var headings = data[0];
  const artists = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === 'live') {
      var artist = {};
      for (var j = 0; j < headings.length; j++) {
        artist[headings[j].toString()] = data[i][j];
      }
      artists.push(artist);
    }
  }

  var artistsStringy = JSON.stringify(artists);

  cache.put(genre, artistsStringy, 180);

  return artistsStringy;
}

function getData() {
  var artists = [];
  var cache = ChunkyCache(CacheService.getScriptCache(), 1024 * 90);

  var cached = cache.get('all');
  if (cached != null) {
    return cached;
  }

  for (var n in document.getSheets()) {
    var sheet = document.getSheets()[n];
    var name = sheet.getName();
    if (name !== 'genres (nein das funktioniert noch nicht :D)') {
      var range = sheet.getDataRange();
      var data = range.getValues();
      var headings = data[0];

      for (var i = 1; i < data.length; i++) {
        if (data[i][1] === 'live') {
          var artist = {};
          for (var j = 0; j < headings.length; j++) {
            artist[headings[j].toString()] = data[i][j];
          }
          artists.push(artist);
        }
      }
    }
  }

  var artistsStringy = JSON.stringify(artists);

  cache.put('all', artistsStringy, 180);

  return artistsStringy;
}

// This is a function that fires when the webapp receives a GET request
function doGet(request) {
  if (request.parameter.genre !== undefined) {
    var genre = request.parameter.genre;
    var artists = genre === 'all' ? getData() : genreQuery(genre);

    return ContentService.createTextOutput(artists).setMimeType(
      ContentService.MimeType.JSON
    );
  } else {
    return ContentService.createTextOutput(
      'Invalid Request joo. Use a valid "genre" parameter.'
    );
  }
}

// This is a function that fires when the webapp receives a POST request
function doPost(event) {
  // Logger.log(event)
  var data = JSON.parse(event.postData.contents);

  var sheet = document.getSheetByName(data.genre);
  var idCount = sheet.getLastRow();

  sheet.insertRowBefore(2);

  var timestamp = new Date();

  sheet
    .getRange(2, 1)
    .setFormula(
      '=INDIRECT("$G$2")&"-"&COUNTA(INDIRECT("$G$2:G"))-ARRAYFORMULA(ROW() - 1) + 1'
    );
  sheet.getRange(2, 2).setValue('review');
  sheet.getRange(2, 3).setValue(data.name || '');
  sheet.getRange(2, 4).setValue(data.lat || '');
  sheet.getRange(2, 5).setValue(data.lng || '');
  sheet.getRange(2, 6).setValue(data.locationName || '');
  sheet.getRange(2, 7).setValue(data.genre || '');
  sheet.getRange(2, 9).setValue(data.description || '');
  sheet.getRange(2, 10).setValue(data.infoLink || '');
  sheet.getRange(2, 11).setValue(data.mediaLink || '');
  sheet.getRange(2, 12).setValue(data.facebookLink || '');
  sheet.getRange(2, 13).setValue(data.instagramLink || '');
  sheet.getRange(2, 14).setValue(data.twitterLink || '');
  sheet.getRange(2, 15).setValue(data.websiteLink || '');
  sheet.getRange(2, 16).setValue(data.user || '');
  sheet.getRange(2, 17).setValue(timestamp);

  return ContentService.createTextOutput({success: true}).setMimeType(
    ContentService.MimeType.JSON
  );

  // SpreadsheetApp.flush();
}
