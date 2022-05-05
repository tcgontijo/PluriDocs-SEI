$(function () {

  console.log("Script injetado no Iframe Visualização")

  $("body").append($(`
    <div id="docModelo" class="modal">
    <h1>Documento modelo - Seleção</h1>
      <div">
        <hr class="divisoria">
        <label>Selecione abaixo, dentre os documentos constantes na árvore do processo, o modelo para reprodução em
          lote:</label>
        <select>
          <option value="teste">Teste</option>
        </select>
        <hr class="divisoria">
        <div>
          <button type="button"><a href="#" rel="modal:close">Cancelar<a/></button>
          <button id="btn-ok-modal1">
            OK
          </button>
        </div>
      </div>
    </div>
  `))

  $("#divArvoreAcoes").append($(`
    <a id="btn-modal" href="#docModelo" rel="modal:open">
      <img src="https://picsum.photos/100/100">
    </a>
  `));




  // $("#btn-modal").on('click', () => {
  //   $("#docModelo").modal();
  // });

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