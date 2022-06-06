import BotaoAcao from "../components/BotaoAcao.js"

//Botão na área de ações para chamar o serviço

!$('#ifrArvoreHtml')[0] &&
  !$(`img[title='Reabrir Processo']`)[0] &&
  $(`img[title='Concluir Processo']`)[0] &&
  BotaoAcao(chrome.runtime.getURL("src/img/btn.png"));

