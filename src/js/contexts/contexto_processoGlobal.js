import { setSeiVersion } from "../functions/functions.js"
import BotaoMock from "../components/BotaoMock.js"
import ModalSelecaoDoc from "../components/ModalSelecaoDoc.js"
import ModalAnaliseModelo from "../components/ModalAnaliseModelo.js"
import ModalSelecaoBaseDados from "../components/ModalSelecaoBaseDados.js"
import ModalAnaliseCSV from "../components/ModalAnaliseCSV.js"
import ModalCruzamentoDados from "../components/ModalCruzamentoDados.js"
import ModalLoader from "../components/ModalLoader.js"
import ModalErro from "../components/ModalErro.js"

setSeiVersion();
BotaoMock();
ModalSelecaoDoc();
ModalAnaliseModelo();
ModalSelecaoBaseDados();
ModalAnaliseCSV();
ModalCruzamentoDados();
ModalLoader();
ModalErro();

