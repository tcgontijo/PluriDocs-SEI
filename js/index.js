$(function () {

  console.log("extensão funcionando")
  $("body").append($(`
    <div class="modal fade" id="docModelo" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Documento modelo - Seleção</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <label>Selecione abaixo, dentre os documentos constantes na árvore do processo, o modelo para reprodução em
            lote:</label>
          <select class="form-select">

          </select>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
          <button id="btn-ok-modal1" class="btn btn-primary">
            <span id="loader" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span id="textOK">OK</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  `))
  $("#divArvoreAcoes").append($(`
    <a id="btn-modal" data-bs-toggle="modal" href="#docModelo" role="button">
      <img src="https://picsum.photos/100/100">
    </a>
  `));




  $("#btn-modal").click(() => {
    $("#loader").hide()
    $("#textOK").show();
  });

  $("#btn-ok-modal1").click(e => {
    $("#loader").show();
    $("#textOK").hide();
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


})