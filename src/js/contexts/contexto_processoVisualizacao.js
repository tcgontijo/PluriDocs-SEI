import BotaoAcao from "../components/BotaoAcao.js"

//Botão na área de ações para chamar o serviço

if (!$('#ifrArvoreHtml')[0])
  BotaoAcao(chrome.runtime.getURL("src/img/btn.png"));

