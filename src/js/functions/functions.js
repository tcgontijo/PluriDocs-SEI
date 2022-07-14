import { specialChars, normalChars } from '../util/encodingTables.js';


let dataDocs = [];
let dynamicFields = [];
let CSVData = [];
let CSVHeaders = [];
let dataCrossing = []
let selectedModel = {};
let CSVFileName = '';
let docsNames = '';
let aborted = false;
let flagError = false;

export const setSeiVersion = () => {
  const logoSeiTitle = $(`img[title^=Sistema]`).attr('title')
  const version = logoSeiTitle.substring(logoSeiTitle.lastIndexOf(" ") + 1, logoSeiTitle.length);

  localStorage.setItem('versaoSei', version);
}

export const getSeiVersion = () => {
  return localStorage.getItem('versaoSei');
}

const fillSelect = (select) => {
  let resultado = '';
  let contadorDocsValidos = 0;
  dataDocs.forEach((doc) => {
    if (doc.cancelado || doc.externo || !doc.src)
      resultado += `<option value="${doc.nome}" disabled title="Documento não válido para replicação em lote">${doc.nome}</option>`
    else {
      resultado += `<option value="${doc.nome}">${doc.nome}</option>`;
      contadorDocsValidos++;
    }
  })
  if (contadorDocsValidos === 0) {
    select.after(`<small class="noFieldsError">Não há documentos válidos para reprodução no processo<small>`);
  } else
    select.removeAttr('disabled');
  select.children().remove();
  select.append(resultado);
}

export const getDocsArvore = () => {

  const select = $('#docModelo select');
  $('#docModelo small').remove();//remoção de eventuais mensagens de erro residuais

  dataDocs = [];

  /* Loader de busca de documentos na árvore */
  select.children().remove();
  select.attr('disabled', 'disabled')
  let loadingText = 'Buscando documentos ';
  let counter = 0;

  select.append(`<option><span class="spin">${loadingText}</span></option>`)
  const addSymbol = () => {
    if (counter < 3) {
      loadingText += '🔍'
      counter++;
    }
    else {
      loadingText = 'Buscando documentos ';
      counter = 0;
    }
    select.find('option').text(loadingText);
  }
  const loadingInteval = setInterval(addSymbol, 200)

  /* Verifica se existe o botão (+) para expandir pastas na árvore */
  const urlBtnExpandirPastas = $("#ifrArvore").contents().find("[id^='anchorAP']").attr('href');
  const urlArvore = $("#ifrArvore").attr('src');

  const urlBusca = urlBtnExpandirPastas ? urlBtnExpandirPastas : urlArvore;


  $.get(urlBusca).done((htmlArvore) => {
    const lines = htmlArvore.split('\n');
    const pattern1 = /^Nos\[\d{1,}\] = new infraArvoreNo\("DOCUMENTO/i;
    const pattern2 = /^Nos\[\d{1,}\]\.src = 'controlador/

    lines.forEach((line) => {
      if (pattern1.test(line)) {
        const nrNo = line.substring(1, line.indexOf(']')).match(/\d{1,}/)[0];
        const props = line.slice(line.indexOf('(') + 1, line.lastIndexOf(')')).replaceAll(`"`, ``).replaceAll(`\\\\`).split(',');

        if (props[17])//documentos com vírgula têm quebra de linha por conta do split. Esta condição concatena as linhas quebradas
          dataDocs.push({
            nrNo,
            nome: `${props[5]},${props[6]}`,
            numero: props[17],
            cancelado: props[7].startsWith('Documento Cancelado') ? true : false,
            externo: props[9].includes('documento_interno') ? false : true
          });
        else
          dataDocs.push({
            nrNo,
            nome: props[5],
            numero: props[15],
            cancelado: props[6].startsWith('Documento Cancelado') ? true : false,
            externo: props[9].includes('documento_interno') ? false : true
          });
      }
    })

    lines.forEach((line) => {//Percorre o array novamente em busca dos links diretos para os documentos
      if (pattern2.test(line)) {
        const nrNo = line.substring(1, line.indexOf(']')).match(/\d{1,}/)[0];
        const src = line.substring(line.indexOf(`'`) + 1, line.lastIndexOf(`'`))
        const docMatched = dataDocs.find((dataDoc) => dataDoc.nrNo === nrNo);
        dataDocs[dataDocs.indexOf(docMatched)] = { ...docMatched, src };
      }
    })

    fillSelect(select);
    clearInterval(loadingInteval);//para o loader

  }).then(() => {
    $("#btnSelecaoDoc").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
  })
}

export const clearInputs = () => $('.ui-dialog input').each(function () { $(this).val('') })

export const docAnalysis = (protocolo) => {
  $('#fieldList').remove();
  dynamicFields = [];

  if (!$('#loaderAnalysis')[0])//Só o loader renderiza se já não existir
    $('#analiseDocModelo').append(`<span id='loaderAnalysis' class='ui-icon ui-icon-loading-status-balls spin loader-analise'></span>`);
  $("#btnConfirmAnalysis").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled')//Desabilita Botão OK até o carregamento


  const selectedDoc = dataDocs.find((doc) => doc.numero === protocolo);

  $.get(selectedDoc.src).done((contentDoc) => {
    const body = contentDoc.substring(contentDoc.indexOf('<body>'), contentDoc.lastIndexOf('</body>'))
    const matches = Array.from(new Set(body.match(/##.+?##/gm)));//rearranjo para remover duplicatas
    fillModelAnalysis(matches, selectedDoc);
  }).then(() => {
    $("#loaderAnalysis").remove();
  })
}

const fillModelAnalysis = (matches, selectedDoc) => {

  selectedModel = selectedDoc;
  dynamicFields = matches.map((field) => field.trim());

  $('#analiseDocModelo').append(`<div id='fieldList'></div>`)
  $('#fieldList').append(`<p class="textAnalysis"><span class='ui-icon ui-icon-arrow-r'></span> Documento: ${selectedDoc.nome}</p>`)
  if (matches.length) {

    let lista = `<ul class="textAnalysis">\n`;
    matches.forEach((field) => {
      lista += `<li>${field.replaceAll('#', '')}</li>\n`
    })
    lista += '</ul>';
    $('#fieldList').append(`<p class="textAnalysis dFielTitle"><span class='ui-icon ui-icon-arrowreturn-1-s curvedArrow'></span> Campos dinâmicos detectados:</p>`)
    $('#fieldList').append(lista);
    $("#btnConfirmAnalysis").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
  } else {
    $('#fieldList').append(`<small class="noFieldsError">Não foi identificado nenhum campo dinâmico no documento modelo informado. Verifique se os mesmos foram redigidos corretamente com o padrão ##nome do campo##.</small>`)
  }

  adjustModalPosition('analiseDocModelo');

}

export const CSVAnalysis = (file) => {

  $('#fieldListCSV').remove();

  if (!$('#loaderAnalysisCSV')[0])//Só renderiza se já não existir
    $('#analiseCSV').append(`<span id='loaderAnalysisCSV' class='ui-icon ui-icon-loading-status-balls spin loader-analise'></span>`);

  Papa.parse(file, {
    header: true,
    skipEmptyLines: "greedy",
    encoding: "windows-1252",
    complete: (results) => {
      fillCSVAnalysis(results, file.name);
      $("#loaderAnalysisCSV").remove();
      adjustModalPosition('analiseCSV');
    }
  })
}

const fillCSVAnalysis = (parseData, filename) => {

  CSVFileName = filename;
  CSVData = parseData.data;

  CSVHeaders = Object.keys(CSVData[0]).filter(Boolean);//Rearranjo para remover cabeçalhos vazios

  $('#analiseCSV').append(`<div id='fieldListCSV'></div>`)
  $('#fieldListCSV').append(`<p class="textAnalysis"><span class='ui-icon ui-icon-arrow-r'></span> Arquivo: ${filename}</p>`)
  if (CSVHeaders.length) {
    let lista = `<ul class="textAnalysis">\n`;
    CSVHeaders.forEach((field) => {
      lista += `<li>${field}</li>\n`
    })
    lista += '</ul>';
    $('#fieldListCSV').append(`
    <p class="textAnalysis dFielTitle"><span class='ui-icon ui-icon-arrowreturn-1-s curvedArrow'></span> Quantidade de registros: ${CSVData.length}</p>
    <p class="textAnalysis dFielTitle"><span class='ui-icon ui-icon-arrowreturn-1-s curvedArrow'></span> Cabeçalhos detectados:</p>
    ${lista}`);
    $("#btnConfirmAnalysis").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
  } else {
    $('#fieldListCSV').append(`<small class="noFieldsError">Não foi identificado nenhum cabeçalho no arquivo enviado. Verifique se a planilha não está vazia.</small>`)
  }
}

export const printDataCrossing = () => {
  $('#divTableDataCrossing').remove();
  $('#cruzData .noFieldsError').remove();

  dataCrossing = [];

  const cleanFields = dynamicFields.map((field) => field.replaceAll('#', ''));
  CSVHeaders.forEach((header) => {
    try {
      const matchedDynamicField = cleanFields.find((field) => field === header);
      if (matchedDynamicField)
        dataCrossing.push(header)
    } catch {
      return
    }
  })

  if (!dataCrossing[0]) {
    $('#cruzData').append(`
    <small class="noFieldsError">Não existe correspondência no arquivo CSV informado!</small>
    `)
  } else {

    let tbody = '';
    dataCrossing.forEach((data) => {
      tbody += `
          <tr>
            <td>${data}</td>
            <td id="arrow-data-crossing"><span class='ui-icon ui-icon-arrow-1-e'></span></td>
            <td>##${data}##</td>
          </tr>
          `;
    })

    let selectData = '';
    CSVHeaders.forEach(header => {
      selectData += `<option>${header}</option>`
    })


    $('#cruzData').append(`
      <div id="divTableDataCrossing">
        <table id="tableDataCrossing">
          <thead>
            <th>${CSVFileName}</th>
            <th></th>
            <th>${selectedModel.nome}</th>
          </thead>
          <tbody>
            ${tbody}
          </tbody>
        </table>
    
      <hr style="all:revert">
      <div>
        <p>Nome do documento na árvore de processos*</p>
        <select id="nomesDoc">${selectData}</select>
        <small>*Alguns documentos possuem a propriedade <b>Número</b> que quando preenchida exibe o valor na árvore de processos logo após o tipo. Exemplo: Anexo Contrato (Anexo = tipo e Contrato=Número)</small>
      </div>
      </div>
      `)

    //Implementação de opção de exclusão de documento modelo após término
    /*<hr style="all:revert">
    <div id="checkDeleteModel">
      <input type="checkbox" checked>
      <p id="labelCheckDeleteModel">Excluir Documento Modelo após procedimento</p>
    </div>
    */

  }

  adjustModalPosition('cruzData');
  setTimeout(() => $('#cruzData')[0].scrollTo(0, 0), 300);
}

const adjustModalPosition = label => {
  const modal = $(`div[aria-describedby='${label}']`)[0];
  const modalHeight = modal.offsetHeight;
  const windowHeight = window.innerHeight;
  const newModalTopDistance = (windowHeight - modalHeight) / 2;

  $(modal).css('top', newModalTopDistance);
}

export const getDocsNames = () => {
  docsNames = $('#nomesDoc').val();
}

export const execute = async () => {

  const urlNewDoc = $('#ifrVisualizacao').contents().find("img[title='Incluir Documento'").parent().attr('href');

  const regex = new RegExp(Object.keys(normalChars).join('|'));
  const hasSpecialChars = CSVData.some(data => data[docsNames].match(regex))
  if (hasSpecialChars) {
    const confirmSpecialChars = confirm(`
Os nomes escolhidos para constar na árvore de processos contém caracteres especiais.

O ideal é que não possuam. Portanto, é possível que ocorram alguns problemas de formatação.

Deseja continuar?
`)
    if (!confirmSpecialChars) {
      $('#execucao').dialog('close');
      $("#cruzData").dialog("open");
      return;
    }
  }

  for (let i = 0; i < CSVData.length; i++) {

    try {

      const response1 = await clickNewDoc(urlNewDoc);

      const response2 = await selectDocType(response1.urlExpandDocList);

      const response3 = await formNewDoc(response2.urlFormNewDoc, CSVData[i]);

      const response4 = await confirmDocData(response3.urlConfirmDocData, response3.params);

      const response5 = await editDocContent(response4.urlEditor, CSVData[i]);

      const response6 = await saveDoc(response5.urlSubmitForm, response5.paramsSaveDoc);

      response6.success && $('#progress').html(`<p style="text-align:center">${i + 1}/${CSVData.length}</p>`);

    } catch (e) {
      if (e.message && e.message === "cancel") {
        $('#ifrArvore').contents()[0].location.reload();
        setTimeout(() => {
          $('#cancelExecute').hide();
          $('#progress').html(`<p style="text-align:center">${aborted ? "Progresso cancelado!" : "Reprodução em lote finalizada com sucesso!"}</p>`)
          setTimeout(() => {
            $('#execucao').dialog('close');
            $('#cancelExecute').show();
            $('#progress').html(`<p style="text-align:center">Preparando ambiente</p>`)
          }, 2000);
        }, 500)
      } else {
        flagError = true;
        $('#execucao').dialog('close');
        $('#modalErro').dialog('open');
      }
      aborted = false;
      break;
    }
  }

}


const clickNewDoc = async (urlNewDoc) => {

  const htmlChooseDocType = await $.get(urlNewDoc);
  const urlExpandDocList = $(htmlChooseDocType).find('#frmDocumentoEscolherTipo').attr('action');

  if (aborted) throw new Error("cancel");
  return {
    urlExpandDocList,
    success: true
  }
}

const selectDocType = async (urlExpandDocList) => {

  const htmlExpandedDocList = await $.ajax({
    method: 'POST',
    url: urlExpandDocList,
    data: { hdnFiltroSerie: 'T' }
  })

  const htmlTypeList = $(htmlExpandedDocList).find('.ancoraOpcao')
  let typeList = []
  for (let i = 0; i < htmlTypeList.length; i++) {
    typeList.push({
      nome: htmlTypeList[i].textContent,
      url: htmlTypeList[i].getAttribute("href")
    })
  }
  let urlFormNewDoc = '';
  typeList.some((type) => {
    if (selectedModel.nome.startsWith(type.nome)) {
      urlFormNewDoc = type.url;
      return true;
    }
  })
  if (aborted) throw new Error("cancel");
  return {
    urlFormNewDoc,
    success: true
  };
}
const formNewDoc = async (urlFormNewDoc, data) => {

  const htmlFormNewDoc = await $.get(urlFormNewDoc);

  const form = $(htmlFormNewDoc).find('#frmDocumentoCadastro')
  const urlConfirmDocData = form.attr('action');

  const numeroOpcional = form.find("#lblNumero").attr('class') === 'infraLabelOpcional';

  let params = {};
  form.find("input[type=hidden]").each(function () {
    if ($(this).attr('name') && $(this).attr('id').includes('hdn')) {
      params[$(this).attr('name')] = $(this).val();
    }
  });
  form.find('input[type=text]').each(function () {
    if ($(this).attr('id') && $(this).attr('id').includes('txt')) {
      params[$(this).attr('id')] = $(this).val();
    }
  });
  form.find('select').each(function () {
    if ($(this).attr('id') && $(this).attr('id').includes('sel')) {
      params[$(this).attr('id')] = $(this).val();
    }
  });
  form.find('input[type=radio]').each(function () {
    if ($(this).attr('name') && $(this).attr('name').includes('rdo')) {
      params[$(this).attr('name')] = $(this).val();
    }
  });
  params.rdoNivelAcesso = '0';
  params.hdnFlagDocumentoCadastro = '2';
  params.txaObservacoes = '';
  params.txtDescricao = '';
  params.txtProtocoloDocumentoTextoBase = selectedModel.numero;
  const regex = new RegExp(Object.keys(normalChars).join('|'), 'g');
  params.txtNumero = numeroOpcional ? '' : data[docsNames].replace(regex, (match) => normalChars[match]);

  if (aborted) throw new Error("cancel");
  return {
    urlConfirmDocData,
    params,
    success: true
  };
}
const confirmDocData = async (urlConfirmDocData, params) => {

  const htmlDocCreated = await $.ajax({
    method: 'POST',
    url: urlConfirmDocData,
    data: params
  })
  const lines = htmlDocCreated.split('\n');
  let urlEditor = '';
  if (getSeiVersion().startsWith("3")) {
    urlEditor = lines.filter((line) => line.includes(`if ('controlador.php?acao=editor_montar`))[0].match(/'(.+)'!/)[1];
  }
  else if (getSeiVersion().startsWith("4")) {
    urlEditor = lines.filter((line) => line.includes(`infraAbrirJanela('controlador.php?acao=editor_montar`))[0].match(/'(.+?)'/)[0].replaceAll("'", "");;
  }
  else
    throw new Error('versão do SEI incompatível');

  if (aborted) throw new Error("cancel");

  return {
    urlEditor,
    success: true
  };

}

const editDocContent = async (urlEditor, data) => {

  const htmlEditor = await $.get(urlEditor);//TODO: Lançar exceção, identificar e excluir o doc gerado erroneamente

  const urlSubmitForm = $(htmlEditor).filter((_, el) => $(el).attr('id') === 'frmEditor').attr('action');

  const textAreas = $(htmlEditor).find('div#divEditores textarea');

  const regex1 = new RegExp(dataCrossing.map((data) => `##${data}##`).join('|'), 'g');
  const regex2 = new RegExp(Object.keys(specialChars).join('|'), 'g');

  const textAreasReplaced = textAreas.map((_, el) =>
    $(el).text().replace(regex1, (match) =>
      data[match.substring(2, match.length - 2)].replace(regex2, (match) => specialChars[match])
    )
  )

  let paramsSaveDoc = {};
  textAreasReplaced.each((i, textArea) => {
    paramsSaveDoc[$(textAreas).eq(i).attr('name')] = textArea;
  });

  $(htmlEditor).find('input[type=hidden').each((_, input) => {
    paramsSaveDoc[$(input).attr('name')] = $(input).val();
  })

  if (aborted) throw new Error("cancel");
  return {
    urlSubmitForm,
    paramsSaveDoc,
    success: true
  }

}
const saveDoc = async (urlSubmitForm, paramsSaveDoc) => {
  const responseSave = await $.ajax({
    method: 'POST',
    url: urlSubmitForm,
    data: paramsSaveDoc,
  })
  if (aborted) throw new Error("cancel");

  if (responseSave.startsWith("OK")) {
    return { success: true }
  } else {
    throw Error();
  }

}

export const abortAjax = () => {
  if (!flagError) {
    aborted = true;
    $('#cancelExecute').hide();
    $('#progress').html(`<p style="text-align:center">Cancelando progresso</p>`)
  }
}

