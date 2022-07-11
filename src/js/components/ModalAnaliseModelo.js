import * as functions from '../functions/functions.js'

const ModalAnaliseDocModelo = () => {

  const seiVersion = functions.getSeiVersion();

  $('body').append(`
  <div id="analiseDocModelo" title="Documento modelo - Campos dinâmicos">
  <p>Análise do documento modelo:</p>
  </div>
  `)

  $('#analiseDocModelo').dialog({
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
        id: 'btnConfirmAnalysis',
        text: "Ok",
        prepend: `<span class='ui-icon ui-icon-circle-b-check'></span>`,
        click: function () {
          $(this).dialog("close");
          $("#baseDados").dialog("open");
        }
      },
      {
        text: "Voltar",
        prepend: `<span class='ui-icon ui-icon-arrowreturn-1-w'></span>`,
        click: function () {
          $('#docModelo').dialog('open');
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

export default ModalAnaliseDocModelo;