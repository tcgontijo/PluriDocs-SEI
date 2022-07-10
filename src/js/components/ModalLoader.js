import * as functions from '../functions/functions.js'

const ModalLoader = () => {
  $('body').append(`
    <div id="execucao" title="Pluridocs">
    <div style="margin: 15px">
    <span class='ui-icon ui-icon-loading-status-balls spin loader-execute'></span>
    </div>
    <div id="progress">
    <p style="text-align:center" id="preparingProgress">Preparando ambiente</p>
    </div>
    </div>
  `)

  $('#execucao').dialog({
    autoOpen: false,
    resizable: false,
    classes: {
      "ui-dialog": "modalPluri"
    },
    position: { my: "center", of: window },
    width: 300,
    show: 100,
    close: () => {
      $(this).dialog("close");
      functions.clearInputs();
      functions.abortAjax();
    },
    modal: true,
    buttons: [
      {
        text: "Cancelar",
        id: 'cancelExecute',
        prepend: `<span class='ui-icon ui-icon-circle-b-close'></span>`,
        click: function () {
          functions.clearInputs();
          functions.abortAjax();
        }
      }
    ]
  });
}

export default ModalLoader;