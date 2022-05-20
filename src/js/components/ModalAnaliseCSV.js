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
    modal: true,
    show: 200,
    buttons: [
      {
        id: 'btnConfirmAnalysisCSV',
        text: "Ok",
        prepend: `<span class='ui-icon ui-icon-circle-b-check'></span>`,
        click: function () {
          //$(this).dialog("close");
          //$("#baseDados").dialog("open");
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
      }
    ]
  });
}

export default ModalAnaliseCSV;