import * as functions from './functions.js';

export const botaoAcao = (imgURL) => {
  $("#divArvoreAcoes").append($(`
    <a id="btn-modal" class="botaoSEI" tabindex="451">
      <img class="infraCorBarraSistema" src="${imgURL}" title="Inserir arquivos em lote">
    </a>
`))

  $('#btn-modal').click(() => {
    $("#docModelo").dialog("open");
  });
};


export const modalSelecaoDoc = () => {
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
    width: 500,
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

  //$('#docModelo select').selectmenu();
}


export const modalAnaliseDocModelo = () => {
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
    width: 500,
    modal: true,
    show: 200,
    buttons: [
      {
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


export const modalBaseDados = () => {
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
    width: 500,
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




