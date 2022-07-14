import BotaoAcao from "../components/BotaoAcao.js"

/**
 * Arranjo para mostrar o botão somente quando o estiver na página inicial de um processo 
 */

!$('#ifrArvoreHtml')[0] &&
  !$(`img[title='Reabrir Processo']`)[0] &&
  $(`img[title='Concluir Processo']`)[0] &&
  BotaoAcao(chrome.runtime.getURL("src/img/btn.png"));

