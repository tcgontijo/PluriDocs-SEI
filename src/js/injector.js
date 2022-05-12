
$(function () {

  (async () => {
    await import(chrome.runtime.getURL('src/js/context.js'));
  })().then(() => {
    $('head').append(`
  <link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL("src/css/libs/jquery-ui.css")}" ></link>
  <link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL("src/css/libs/jquery-ui.icon-font.min.css")}" ></link>
  `);

    $.getScript(chrome.runtime.getURL("src/js/libs/papaparse.js"));
  });

});