import * as functions from '../functions.js';

const ModalSelecaoDoc = () => {
  $('body').append(`
    <div id="docModelo" title="Documento modelo - Seleção">
      <p>Selecione abaixo, dentre os documentos constantes na árvore do processo, o modelo para reprodução em lote:</p>
      <select>${functions.getDocsArvore()}</select>
    </div>
  `)

  $('#docModelo').dialog({
    autoOpen: false,
    resizable: false,
    classes: {
      "ui-dialog": "modalPluri"
    },
    width: 600,
    show: 100,
    modal: true,
    buttons: [
      {
        text: "Ok",
        prepend: `<span class='ui-icon ui-icon-circle-b-check'></span>`,
        click: function () {
          //Acessar conteúdo do documento e localizar campos dinâmicos
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
    ]
  });
}

export default ModalSelecaoDoc;