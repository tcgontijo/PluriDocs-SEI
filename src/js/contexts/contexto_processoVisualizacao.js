import BotaoAcao from "../components/BotaoAcao.js"

/**
 * Arranjo para mostrar o botão somente quando o estiver na página inicial de um processo 
 */

setTimeout(() => {

  !$('#ifrArvoreHtml')[0] &&
    !$(`img[alt='Reabrir Processo']`)[0] &&
    $(`a[onclick='concluirProcesso();']`)[0] &&
    BotaoAcao(chrome.runtime.getURL("src/img/btn.png"));

}, localStorage.getItem('seiSlim') ? 1000 : 300);







