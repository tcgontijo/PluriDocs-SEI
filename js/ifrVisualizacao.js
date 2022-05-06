$(function () {

  console.log("Script injetado no Iframe Visualização")

  let jquery = $('<link href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" rel="stylesheet" type="text/css" media="all">');

  $('head', parent.window.document).append(jquery);
  $('head').append(jquery);

  setTimeout(() => {
    $("body", parent.window.document).append($(`
    <div id="docModelo" title="Documento modelo - Seleção">
      <label>Selecione abaixo, dentre os documentos constantes na árvore do processo, o modelo para reprodução em
        lote:</label>
      <select>
        <option value="teste">Teste</option>
      </select>
    </div>
  `))


    // href="#docModelo" rel="modal:open"
    $("#divArvoreAcoes").append($(`
    <a id="btn-modal">
      <img src="https://picsum.photos/100/100">
    </a>
  `));



    $("#docModelo", parent.window.document).dialog({
      autoOpen: false,
      modal: true,
      buttons: [
        {
          text: "Ok",
          icon: "ui-icon-heart",
          iconPosition: "end",
          click: function () {
            $(this).dialog("close");
          }
        },
        {
          text: "Cancelar",
          icon: "ui-icon-cancel",
          iconPosition: "beginning",
          click: function () {
            $(this).dialog("close");
          }
        }
      ]
    });
    $("#btn-modal").on('click', () => {
      $("#docModelo", parent.window.document).dialog("open");
    });

    // CSV PARSER
    /*$("#input").change(() => {
      $("#btn").removeAttr('disabled')
    })
  
    $("#btn").click(() => {
      Papa.parse($("#input")[0].files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("Finished:", results.data);
        }
      })
    });*/

  }, 3000)
})