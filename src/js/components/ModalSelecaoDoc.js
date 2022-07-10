import * as functions from '../functions/functions.js'

const ModalSelecaoDoc = () => {

  $('body').append(`
    <div id="docModelo" title="Documento modelo - Seleção">
      <p>Selecione abaixo, dentre os documentos constantes na árvore do processo, o modelo para reprodução em lote:</p>
      <select></select>
    </div>
  `)

  $('#docModelo').dialog({
    autoOpen: false,
    resizable: false,
    classes: {
      "ui-dialog": "modalPluri"
    },
    position: { my: `center top+${functions.getSeiVersion().startsWith('4') ? "70" : "30"}`, at: "center top", of: window },
    width: 600,
    show: 100,
    modal: true,
    open: () => {
      $("#btnSelecaoDoc").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
      $('#docModelo .chosen-container').hide();//ajuste para compatibilidade com SEI PRO no SEI 4
      functions.getDocsArvore();
    },
    buttons: [
      {
        id: 'btnSelecaoDoc',
        text: "Ok",
        prepend: `<span class='ui-icon ui-icon-circle-b-check'></span>`,
        click: function () {

          if ($(this).find('small')[0]) {
            $(this).dialog("close");
            functions.clearInputs();
          } else {
            /* Isola o número do documento a partir do nome */
            const selected = $(this).find('select').val().trim()
            const nrDoc = selected.substring(selected.lastIndexOf(' '), selected.length).match(/\d+/i)[0];
            functions.docAnalysis(nrDoc);
            $('#analiseDocModelo').dialog('open');
            $(this).dialog("close");
          }
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

export default ModalSelecaoDoc;