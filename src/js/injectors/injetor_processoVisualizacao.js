
$(function () {

  (async () => {
    await import(chrome.runtime.getURL('src/js/contexts/contexto_processoVisualizacao.js'));
  })()
  .then(() => {
    $('head').append(`
  <link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL("src/css/libs/jquery-ui.css")}" ></link>
  <link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL("src/css/libs/jquery-ui.icon-font.min.css")}" ></link>
  `);
  });

});