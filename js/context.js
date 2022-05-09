import * as components from "./components.js";
import * as functions from "./functions.js";

$(() => {

  components.botaoAcao("https://picsum.photos/100/100");
  components.modalSelecaoDoc(functions.getDocsArvore());
  components.modalAnaliseDocModelo();
  components.modalBaseDados();

})