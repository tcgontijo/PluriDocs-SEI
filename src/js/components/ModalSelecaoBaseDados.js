import * as functions from '../functions/functions.js'

const ModalSelecaoBaseDados = () => {
  $('body').append(`
  <div id="baseDados" title="Base de dados">
  <p>Selecione um arquivo no formato CSV para servir como base de dados para a geração de documentos em lote:</p>
  <input id="inputBD" type="file" accept=".csv, text/csv"></input>
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
          $('#baseDados small').remove();
          const file = $("#inputBD")[0].files[0];
          if (file.name.substring(file.name.lastIndexOf("."), file.name.length).toLocaleLowerCase().trim() === ".csv") {
            functions.CSVAnalysis($("#inputBD")[0].files[0]);
            $('#analiseCSV').dialog('open');
            $('#baseDados').dialog("close");
          } else {
            $('#inputBD').after(`<small class="noFieldsError">Arquivo inválido! Selecione um documento no formato "CSV".</small>`)
          }
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
          $('#baseDados small').remove();
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