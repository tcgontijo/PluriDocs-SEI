import * as funtions from './functions.js';

export const botaoAcao = (imgURL) => {
  $("#divArvoreAcoes").append($(`
  <a id = "btn-modal">
    <img src="${imgURL}">
  </a>
`))

  $('#btn-modal').click(() => {
    $("#docModelo").dialog("open");
  });
};

export const modalSelecaoDoc = (selectContent) => {
  $("body").append(`
  <div id="docModelo" title="Documento modelo - Seleção">
  <p>Selecione abaixo, dentre os documentos constantes na árvore do processo, o modelo para reprodução em lote:</p>
  <select>${selectContent}</select>
  </div>
  `)

  $('#docModelo').dialog({
    autoOpen: false,
    resizable: false,
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
          funtions.clearInputs();
          //$('input:file').each(function () { $(this).trigger('reset') });
        }
      }
    ]
  });
}

export const modalAnaliseDocModelo = () => {
  $("body").append(`
  <div id="analiseDocModelo" title="Documento modelo - Campos dinâmicos">
    <p>Análise do documento modelo:</p>
  </div>
  `)

  $('#analiseDocModelo').dialog({
    autoOpen: false,
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
          funtions.clearInputs();
        }
      }
    ]
  });
}

export const modalBaseDados = () => {

  $("body").append(`
  <div id="baseDados" title="Base de dados">
    <p>Selecione um arquivo no formato CSV para servir como base de dados para a geração de documentos em lote:</p>
    <input id="inputBD" type="file"></input>
  </div>
  `)

  $('#baseDados').dialog({
    autoOpen: false,
    resizable: false,
    width: 500,
    modal: true,
    show: 200,
    buttons: [
      {
        id: 'btnEnviaCSV',
        text: "Enviar",
        prepend: `<span class='ui-icon ui-icon-upload'></span>`,
        click: () => {
          Papa.parse($("#inputBD")[0].files[0], {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              console.log("Finished:", results.data);
            }
          })
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
          funtions.clearInputs();
        }
      }
    ]
  });
  $("#btnEnviaCSV").attr('disabled', 'disabled');

  $("#inputBD").change(() => {
    $("#btnEnviaCSV").removeAttr('disabled');
  })

  // $("#btnEnviaCSV").click(() => {
  //   Papa.parse($("#inputBD")[0].files[0], {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: (results) => {
  //       console.log("Finished:", results.data);
  //     }
  //   })
  // });

}

  // CSV PARSER