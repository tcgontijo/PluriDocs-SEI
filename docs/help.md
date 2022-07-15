# PluriDocs SEI!
---

> A extensão é compatívelo com as versões do SEI 3.x e 4.x. Também não apresentou problemas de compatibilidade com outras extensões, como SEI Pro, SEI++ e SEI+Trello.

---
Bem-vindo(a) à extensão para o navegador Google Chrome PluriDocs SEI!.

Segue abaixo os passos para obtenção de um bom resultado com o programa:

1. Antes de utilizar a extensão propriamente dita, serão necessárias duas preparações prévias, a saber:
    - No mesmo processo onde ocorrerão as replicações, deverá haver um documento modelo contendo campos dinâmicos seguinte padrão:
      -   ##nome_do_campo##
    - Utilizando um editor como: MS Excel, Libre Calc, Google Planilhas, produza uma planilha contendo a base de dados onde a extensão buscará os dados para publicação. Os nomes dos cabeçalhos da planilha deverão coincidir **exatamente** com os nomes inseridos nos campos dinâmicos correspondentes no documento modelo do SEI. A planilha deverá ser salva no formato **.CSV**
 
2. Uma vez realizados os preparativos iniciais, basta clicar no ícone da extensão (
![logo-16](https://user-images.githubusercontent.com/64798940/179245041-bcc4fd7d-5e13-4eac-8a26-862d6bfb1b61.png)), localizado na barra de ícone da tela inicial do processo;

3. Selecione o documento modelo previamente preparado para ser replicado;

4. Na próxima janela será mostrada a análise do documento modelo identificando os campos dinâmicos detectados. Caso esteja conforme esperado clique em "OK";

5. Selecione planilha no formato .CSV previamente preparada para ser a base de dados da replicação;

6. Na próxima janela será mostrada a análise da planilha de base identificando os cabeçalhos detectados e a quantidade de registros. Caso esteja conforme esperado, clique em "OK";

7. Na próxima tela verifique o cruzamento de dados entre `Base de Dados X Documento Modelo`. É também possível selecionar quais nomes os documentos receberão na árvore de processo, caso o tipo de documento a ser replicado exija a inserção de um nome através do campo "Número", presente no formulário de inserção de novo documento.
    - Existe uma tratativa de caracteres especiais (letras acentuadas, símbolos, etc.) na escolha no nome dos documentos na árvore, uma vez que a codificação adotada pelo SEI não é um padrão seguido mundialmente na Web. Para tanto, ao serem detectados caracteres deste tipo nos nomes, será apresentado uma mensagem ao usuário informando esta condição e requerendo sua autorização para proceder.

8. Ao confirmar a tela anterior, e não houverem erros no procedimento, abrirá-se uma janela que indicará o progresso da replicação. Findo este, a tela será atualizada e os novos documentos aparecerão na árvore.


---

Para qualquer dúvida, reportação de erro ou sugestão, por favor me contacte através do e-mail: [gontijo.tulio@gmail.com](mailto:gontijo.tulio@gmail.com)

