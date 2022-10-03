const BotaoAcao = (urlImg) => {


  $("#divArvoreAcoes").append(`
  <a id="btn-modal" class="botaoSEI">
  <img class="infraCorBarraSistema" src=${urlImg}  title="Inserir arquivos em lote">
  </a>
  `)

  // Verifica se a extensão SEI Pro está instalada

  setTimeout(() => {

    const seiProInstalled = $('#iconBatchActions').length ? true : false;

    $('#btn-modal').click(() => {
      seiProInstalled ? alert(`
A extensão PluriDocs está apresentando incompatibilidade com a extensão SEI PRO.
  
Por favor, desabilite o SEI PRO enquanto usa a PluriDocs. 😢
      `)
        :
        $("#trigger-modal", window.parent.document)[0].click();
    });

  }, 1000)


};

export default BotaoAcao;