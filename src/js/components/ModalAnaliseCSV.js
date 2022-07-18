import * as functions from '../functions/functions.js'

const ModalAnaliseCSV = () => {
  $('body').append(`
  <div id="analiseCSV" title="Base de dados - Cabeçalhos e registros">
  <p>Análise da base de dados:</p>
  </div>
  `)

  $('#analiseCSV').dialog({
    autoOpen: false,
    classes: {
      "ui-dialog": "modalPluri"
    },
    resizable: false,
    width: 600,
    maxHeight: (window.innerHeight * 0.9),
    modal: true,
    show: 200,
    buttons: [
      {
        id: 'btnConfirmAnalysisCSV',
        text: "Ok",
        prepend: `<span class='ui-icon ui-icon-circle-b-check'></span>`,
        click: function () {
          $(this).dialog("close");
          $("#cruzData").dialog("open");
        }
      },
      {
        text: "Voltar",
        prepend: `<span class='ui-icon ui-icon-arrowreturn-1-w'></span>`,
        click: function () {
          $('#baseDados').dialog('open');
          $(this).dialog("close");
        }
      },
      {
        text: "Cancelar",
        prepend: `<span class='ui-icon ui-icon-circle-b-close'></span>`,
        click: function () {
          $(this).dialog("close");
          functions.clearInputs();
        }
      },
      {
        text: "Ajuda",
        prepend: `<span class='ui-icon ui-icon-circle-b-help'></span>`,
        click: function () {
          window.open("https://tcgontijo.github.io/PluriDocs-SEI/help")
        }
      }
    ]
  });
}

export default ModalAnaliseCSV;