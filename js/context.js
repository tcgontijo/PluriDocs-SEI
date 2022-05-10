import * as components from "./components.js";


//Botão na área de ações para chamar o serviço
components.botaoAcao(chrome.runtime.getURL("img/btn.png"));

//MODAL 01: Seleção do documento modelo na árvore do processo
components.modalSelecaoDoc();

//MODAL 02: Análise do documento modelo com captura de campos dinâmicos
components.modalAnaliseDocModelo();

//MODAL 03: Escolha da base de dados no formato .CSV
components.modalBaseDados();

//MODAL 04: Análise da Base de dados indicando os cabeçalhos e a quantidade de registros

//MODAL 05: Cruzamento de dados entre os campos dinâmicos do documento modelo e os cabeçalhos da base de dados 

