import BotaoMock from "../components/BotaoMock.js"
import ModalSelecaoDoc from "../components/ModalSelecaoDoc.js"
import ModalAnaliseModelo from "../components/ModalAnaliseModelo.js"
import ModalSelecaoBaseDados from "../components/ModalSelecaoBaseDados.js"
import ModalAnaliseCSV from "../components/ModalAnaliseCSV.js"
import ModalCruzamentoDados from "../components/ModalCruzamentoDados.js"


BotaoMock();

//MODAL 01: Seleção do documento modelo na árvore do processo
ModalSelecaoDoc();

//MODAL 02: Análise do documento modelo com captura de campos dinâmicos
ModalAnaliseModelo();

//MODAL 03: Escolha da base de dados no formato .CSV
ModalSelecaoBaseDados();

//MODAL 04: Análise da Base de dados indicando os cabeçalhos e a quantidade de registros
ModalAnaliseCSV();

//MODAL 05: Cruzamento de dados entre os campos dinâmicos do documento modelo e os cabeçalhos da base de dados 
ModalCruzamentoDados();
