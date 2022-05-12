const BotaoAcao = (imgURL) => {
  $("#divArvoreAcoes").append($(`
    <a id="btn-modal" class="botaoSEI" tabindex="451">
      <img class="infraCorBarraSistema" src="${imgURL}" title="Inserir arquivos em lote">
    </a>
`))

  $('#btn-modal').click(() => {
    $("#docModelo").dialog("open");
  });
};

export default BotaoAcao;