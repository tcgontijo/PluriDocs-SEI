import * as functions from '../functions/functions.js'

const ModalSelecaoBaseDados = () => {
  $('body').append(`
  <div id="baseDados" title="Base de dados">
  <p>Selecione um arquivo no formato CSV para servir como base de dados para a geração de documentos em lote:</p>
  <input id="inputBD" type="file"></input>
  </div>
  `)

  $('#baseDados').dialog({
    autoOpen: false,
    resizable: false,
    classes: {
      "ui-dialog": "modalPluri"
    },
    width: 600,
    modal: true,
    show: 200,
    buttons: [
      {
        id: 'btnEnviaCSV',
        text: "Enviar",
        disabled: true,
        prepend: `<span class='ui-icon ui-icon-upload'></span>`,
        click: () => {
          functions.parseCSV($("#inputBD")[0].files[0]);
          //$(this).dialog("close");
        }
      },
      {
        text: "Voltar",
        prepend: `<span class='ui-icon ui-icon-arrowreturn-1-w'></span>`,
        click: function () {
          $('#analiseDocModelo').dialog('open');
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
    ],
    open: () => {
      if (!$('#inputBD').val())
        $("#btnEnviaCSV").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled')
    }
  });

  $("#inputBD").change(() => {
    $("#btnEnviaCSV").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
  })

}

export default ModalSelecaoBaseDados;