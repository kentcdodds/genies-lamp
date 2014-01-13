(function() {
  var debug = false;
  
  function log() {
    if (debug) {
      console.log.apply(console, arguments);
    }
  }
  
  var lampExists = $('[ux-lamp],[data-ux-lamp]').length > 0;
  if (lampExists) {
    log('there is already a lamp on this page. Don\'t want to mess with it...');
  } else {
    makeWishForAnchors();
    var lamp = '<div class="genie-extension"><div ux-lamp lamp-visible="genieVisible" rub-class="visible" local-storage="true"></div></div>';
    var wrapper = '<div ng-non-bindable>' + lamp + '</div>';
    $('body').append(wrapper);
    angular.module('genie-extension', ['uxGenie']);
    window.name = '';
    angular.bootstrap($('.genie-extension')[0], ['genie-extension']);
  }
  
  function makeWishForAnchors() {
    $($('a,button,input[type=submit],input[type=button]').get().reverse()).each(function() {
      var $el = $(this);
      var magicWords = getMagicWords($el);
      if (magicWords.length > 0) {
        var wish = {
          magicWords: magicWords,
          data: {
            $el: $el
          }
        };
        var id = getWishId($el);
        if (id) {
          wish.id = id.replace(/ /g, '-');
        }
        var icon = getWishIcon($el);
        if (icon) {
          wish.data.uxGenie = {};
          wish.data.uxGenie.iIcon = icon;
        } else {
          var img = getWishImg($el);
          if (img) {
            wish.data.uxGenie = {};
            wish.data.uxGenie.imgIcon = img;
          }
        }
        wish.action = wishAction;
        genie(wish);
        log('Adding wish: ', $el[0]);
      } else {
        log('Not adding wish: ', $el[0]);
      }
    });
  }
  
  function getMagicWords($el) {
    var magicWords = [];
    var text = formatMagicWord($el.text());
    if (text && text.length > 2) {
      magicWords.push(text);
    }
    var value = formatMagicWord($el.attr('value'));
    if (value && value.length > 2) {
      magicWords.push(value);
    }
    var title = formatMagicWord($el.attr('title'));
    if (title && title.length > 2) {
      magicWords.push(title);
    }
    var id = formatMagicWord($el.attr('id'));
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
  
  function getWishId($el) {
    var wishId = $el.attr('href');
    if (!wishId || wishId === '#') {
      wishId = $el.attr('id');
    }
    if (!wishId) {
      wishId = getMagicWords($el).join('-');
    }
    return wishId;
  }
  
  function getWishIcon($el) {
    var i = $el.find('i');
    if (i.length) {
      return i.attr('class');
    } else {
      return null;
    }
  }
  
  function getWishImg($el) {
    var img = $el.find('img');
    if (img.length) {
      return img.attr('src');
    } else {
      return null;
    }
  }
  
  function wishAction(wish) {
    wish.data.$el[0].click();
  }
})();
