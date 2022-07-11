import * as functions from '../functions/functions.js'

const ModalCruzamentoDados = () => {
  $('body').append(`
  <div id="cruzData" title="Cruzamento de dados">
  <p>Segue a abaixo o relacionamento entre cabeçalhos da base de dados e os campos dinâmicos do documento modelo:</p>
  </div>
  `)

  $('#cruzData').dialog({
    autoOpen: false,
    classes: {
      "ui-dialog": "modalPluri"
    },
    resizable: false,
    width: 600,
    maxHeight: (window.innerHeight * 0.9),
    modal: true,
    show: 200,
    open: () => functions.printDataCrossing(),
    buttons: [
      {
        id: 'btnConfirm',
        text: "Ok",
        prepend: `<span class='ui-icon ui-icon-circle-b-check'></span>`,
        click: function () {
          $(this).dialog("close");
          $('#execucao').dialog("open");
          functions.getDocsNames();
          functions.execute();
          functions.clearInputs();
        }
      },
      {
        text: "Voltar",
        prepend: `<span class='ui-icon ui-icon-arrowreturn-1-w'></span>`,
        click: function () {
          $('#analiseCSV').dialog('open');
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

export default ModalCruzamentoDados;