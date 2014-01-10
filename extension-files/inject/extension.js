var debug = false;

function log() {
  if (debug) {
    console.log.apply(console, arguments);
  }
}

var angularExists = $('[ng-app],[data-ng-app],[class*=ng-app]').length > 0;
var lampExists = $('[ux-lamp],[data-ux-lamp]').length > 0;
if (angularExists) {
  log('angular already exists. Can\'t bootstrap another app on this... TODO...')
} else if (lampExists) {
  log('there is already a lamp on this page. Don\'t want to mess with it...');
} else {
  makeWishForAnchors();
  var lamp = '<div class="genie-extension"><div ux-lamp lamp-visible="genieVisible" rub-class="visible" local-storage="true"></div></div>';
  $('body').append(lamp);
  angular.module('genie-extension', ['uxGenie']);
  window.name = '';
  angular.bootstrap($('.genie-extension')[0], ['genie-extension']);
}

function makeWishForAnchors() {
  $($('a,button').get().reverse()).each(function() {
    var $a = $(this);
    var magicWords = getMagicWords($a);
    if (magicWords.length > 0) {
      var wish = {
        magicWords: magicWords,
        data: {
          $el: $a
        }
      };
      var id = getWishId($a);
      if (id) {
        wish.id = id.replace(/ /g, '-');
      }
      var icon = getWishIcon($a);
      if (icon) {
        wish.data.uxGenie = {};
        wish.data.uxGenie.iIcon = icon;
      } else {
        var img = getWishImg($a);
        if (img) {
          wish.data.uxGenie = {};
          wish.data.uxGenie.imgIcon = img;
        }
      }
      wish.action = wishAction;
      genie(wish);
      log('Adding wish: ', $a);
    } else {
      log('Not adding wish: ', $a);
    }
  });
}

function getMagicWords($a) {
  var magicWords = [];
  var text = formatMagicWord($a.text());
  if (text && text.length > 2) {
    magicWords.push(text);
  }
  var value = formatMagicWord($a.attr('value'));
  if (value && value.length > 2) {
    magicWords.push(value);
  }
  var title = formatMagicWord($a.attr('title'));
  if (title && title.length > 2) {
    magicWords.push(title);
  }
  var id = formatMagicWord($a.attr('id'));
  if (id && id.length > 2) {
    magicWords.push(id);
  }
  return magicWords;
}

function formatMagicWord(string) {
  string = (string || '').replace(/\n|\t/g, ' ').replace(/ {2,}/g, ' ').trim();
  if (string.length > 41) {
    string = string.substring(0, 38) + '...';
  }
  return string;
}

function getWishId($a) {
  var wishId = $a.attr('href');
  if (!wishId || wishId === '#') {
    wishId = $a.attr('id');
  }
  if (!wishId) {
    wishId = getMagicWords($a).join('-');
  }
  return wishId;
}

function getWishIcon($a) {
  var i = $a.find('i');
  if (i.length) {
    return i.attr('class');
  } else {
    return null;
  }
}

function getWishImg($a) {
  var img = $a.find('img');
  if (img.length) {
    return img.attr('src');
  } else {
    return null;
  }
}

function wishAction(wish) {
  wish.data.$el[0].click();
}