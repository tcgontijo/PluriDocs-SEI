const BotaoAcao = (urlImg) => {

  $("#divArvoreAcoes").append(`
    <a id="btn-modal" class="botaoSEI">
    <img class="infraCorBarraSistema" src=${urlImg} title="Inserir arquivos em lote">
    </a>
  `)

  $('#btn-modal').click(() => {
    $("#trigger-modal", window.parent.document)[0].click();
  });
};

export default BotaoAcao;