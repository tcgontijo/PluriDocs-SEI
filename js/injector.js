$(function () {

  $('head').append(`
  <link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL("css/libs/jquery-ui.css")}" ></link>
  <link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL("css/libs/jquery-ui.icon-font.min.css")}" ></link>
  <script type="module" src=${chrome.runtime.getURL("js/context.js")}>
  `);

  $.getScript(chrome.runtime.getURL("js/libs/papaparse.js"));

});