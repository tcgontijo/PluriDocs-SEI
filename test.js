const string = `infraAbrirJanela('controlador.php?acao=editor_montar&id_procedimento=62178&id_documento=62201&infra_sistema=100000100&infra_unidade_atual=110000834&infra_hash=1fee754913618ccefe33f660f7264fe145c86e78ac441295ea7337e5e5c1d201','janelaEditor_100000267_62201',infraClientWidth(),infraClientHeight(),'location=0,status=0,resizable=1,scrollbars=1',false);`

console.log(string.match(/'(.+?)'/)[0].replaceAll("'",""));
console.log("\n\n" + string);