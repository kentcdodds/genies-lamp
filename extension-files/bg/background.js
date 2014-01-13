/*
 * Register a listener for `onUpdated` events and 
 * 'genie-fy' all tabs as soon as they have done loading
 */
chrome.tabs.onUpdated.addListener(function(tabId, info) {

  /* Proceed only if the tab has just completed loading */
  if (info.status !== 'complete') {
    return;
  }

  var style = 'inject/styles.css';
  var scripts = [
    'inject/pre-load.js',
    'vendor/jquery.js',
    'vendor/angular.js',
    'vendor/genie.js',
    'vendor/uxGenie.js',
    'inject/extension.js'
  ];

  /* Injects `scripts` one-by-one and then injects `style` */
  var injectOneByOne = function(scriptIndex) {
    /* Report any error that occurred during the last API call */
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    }
    if (scripts[scriptIndex]) {
      chrome.tabs.executeScript(tabId, { file: scripts[scriptIndex] }, injectOneByOne.bind(null, scriptIndex + 1));
    }
  };

  chrome.tabs.insertCSS(tabId, { file: style }, function() {
    /* Initiate the injection process */
    injectOneByOne(0);
  });
});
