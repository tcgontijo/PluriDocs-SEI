import specialChars from '../util/specialChars.js';

let dataDocs = [];
let dynamicFields = [];
let CSVData = [];
let CSVHeaders = [];
let dataCrossing = []
let selectedModel = {};
let CSVFileName = '';
let docsNames = '';
let aborted = false;

// export const getURLExtensao = () => chrome.runtime.getURL("js/injector.js").toString.replace("js/injector.js", '');

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
  $('#docModelo small').remove();

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
    //Percorre o array novamente em busca dos links diretos para os documentos
    lines.forEach((line) => {
      if (pattern2.test(line)) {
        const nrNo = line.substring(1, line.indexOf(']')).match(/\d{1,}/)[0];
        const src = line.substring(line.indexOf(`'`) + 1, line.lastIndexOf(`'`))
        const docMatched = dataDocs.find((dataDoc) => dataDoc.nrNo === nrNo);
        dataDocs[dataDocs.indexOf(docMatched)] = { ...docMatched, src };
      }
    })

    fillSelect(select);
    clearInterval(loadingInteval);

  }).then(() => {
    $("#btnSelecaoDoc").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
  })
}

export const clearInputs = () => $('.ui-dialog input').each(function () { $(this).val('') })

export const docAnalysis = (protocolo) => {
  $('#fieldList').remove();
  dynamicFields = [];
  //Loader
  if (!$('#loaderAnalysis')[0])//Só renderiza se já não existir
    $('#analiseDocModelo').append(`<span id='loaderAnalysis' class='ui-icon ui-icon-loading-status-balls spin loader-analise'></span>`);
  //Desabilita Botão OK
  $("#btnConfirmAnalysis").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled')


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
}

export const CSVAnalysis = (file) => {

  $('#fieldListCSV').remove();

  if (!$('#loaderAnalysisCSV')[0])//Só renderiza se já não existir
    $('#analiseCSV').append(`<span id='loaderAnalysisCSV' class='ui-icon ui-icon-loading-status-balls spin loader-analise'></span>`);

  Papa.parse(file, {
    header: true,
    skipEmptyLines: "greedy",//TODO: testar "greedy" para ver se pula linhas em branco
    encoding: "UTF-8",
    complete: (results) => {
      fillCSVAnalysis(results, file.name);
    }
  })
  $("#loaderAnalysisCSV").remove();
}

const fillCSVAnalysis = (parseData, filename) => {

  CSVFileName = filename;
  CSVData = parseData.data;

  CSVHeaders = Object.keys(CSVData[0]);

  $('#analiseCSV').append(`<div id='fieldListCSV'></div>`)
  $('#fieldListCSV').append(`<p class="textAnalysis"><span class='ui-icon ui-icon-arrow-r'></span> Arquivo: ${filename}</p>`)
  if (CSVHeaders.length) {
    let lista = `<ul class="textAnalysis">\n`;
    CSVHeaders.forEach((field) => {
      lista += `<li>${field}</li>\n`
    })
    lista += '</ul>';
    $('#fieldListCSV').append(`<p class="textAnalysis dFielTitle"><span class='ui-icon ui-icon-arrowreturn-1-s curvedArrow'></span> Quantidade de registros: ${CSVData.length}</p>`)
    $('#fieldListCSV').append(`<p class="textAnalysis dFielTitle"><span class='ui-icon ui-icon-arrowreturn-1-s curvedArrow'></span> Cabeçalhos detectados:</p>`)
    $('#fieldListCSV').append(lista);
    $("#btnConfirmAnalysis").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
  } else {
    $('#fieldListCSV').append(`<small class="noFieldsError">Não foi identificado nenhum cabeçalho no arquivo enviado. Verifique se a planilha não está vazia.</small>`)
  }
}

export const printDataCrossing = () => {
  $('#divTableDataCrossing').remove();
  $('#cruzData .noFieldsError').remove();

  dataCrossing = [];

  const cleanFields = dynamicFields.map((field) => field.replaceAll('#', ''));//.toLocaleLowerCase())
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
    let selectData = '';
    dataCrossing.forEach((data) => {
      const line = `
          <tr>
            <td>${data}</td>
            <td id="arrow-data-crossing"><span class='ui-icon ui-icon-arrow-1-e'></span></td>
            <td>##${data}##</td>
          </tr>
          `;
      selectData += `<option>${data}</option>`
      tbody += line;
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
    // <hr style="all:revert">
    // <div id="checkDeleteModel">
    //   <input type="checkbox" checked>
    //   <p id="labelCheckDeleteModel">Excluir Documento Modelo após procedimento</p>
    // </div>

  }
}

export const getDocsNames = () => {
  docsNames = $('#nomesDoc').val();
}


export const execute = async () => {
  const urlNewDoc = $('#ifrVisualizacao').contents().find("img[title='Incluir Documento'").parent().attr('href');

  for (let i = 0; i < CSVData.length; i++) {

    console.log("😎 👉 aborted", aborted);
    if (aborted) break;

    const urlExpandDocList = await clickNewDoc(urlNewDoc);
    console.log("😎 👉 urlExpandDocList", urlExpandDocList);
    const urlFormNewDoc = await selectDocType(urlExpandDocList);
    const { urlConfirmDocData, params } = await formNewDoc(urlFormNewDoc, CSVData[i]);
    console.log("😎 👉 urlConfirmDocData", urlConfirmDocData);
    const urlEditor = await confirmDocData(urlConfirmDocData, params);
    const { urlSubmitForm, paramsSaveDoc } = await editDocContent(urlEditor, CSVData[i]);
    await saveDoc(urlSubmitForm, paramsSaveDoc, i + 1, CSVData.length);
  }

  $('#ifrArvore').contents()[0].location.reload();
  setTimeout(() => {
    $('#cancelExecute').hide();//TODO: implementar disabled ao invés de hide
    $('#progress').html(`<p style="text-align:center">${aborted ? "Progresso cancelado!" : "Reprodução em lote finalizada com sucesso!"}</p>`)
    setTimeout(() => {
      $('#execucao').dialog('close');
      $('#cancelExecute').show();
      $('#progress').html(`<p style="text-align:center">Preparando ambiente</p>`)
      aborted = false;
    }, 2000);
  }, 500)
}




const clickNewDoc = async (urlNewDoc) => {
  const htmlChooseDocType = await $.get(urlNewDoc).done(htmlChooseDocType => {
    return
  })
  return $(htmlChooseDocType).find('#frmDocumentoEscolherTipo').attr('action')
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
      urlFormNewDoc: htmlTypeList[i].getAttribute("href")
    })
  }
  let url = '';
  typeList.some((type) => {
    if (selectedModel.nome.startsWith(type.nome)) {
      url = type.urlFormNewDoc;
      return true;
    }
  })
  return url;
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
  params.txtNumero = numeroOpcional ? '' : data[docsNames]


  return { urlConfirmDocData, params };
}
const confirmDocData = async (urlConfirmDocData, params) => {
  const htmlDocCreated = await $.ajax({
    method: 'POST',
    url: urlConfirmDocData,
    data: params
  })
  const lines = htmlDocCreated.split('\n');
  if (getSeiVersion().startsWith("3"))
    return lines.filter((line) => line.includes(`if ('controlador.php?acao=editor_montar`))[0].match(/'(.+)'!/)[1];
  else if (getSeiVersion().startsWith("4"))
    return lines.filter((line) => line.includes(`infraAbrirJanela('controlador.php?acao=editor_montar`))[0].match(/'(.+?)'/)[0].replaceAll("'", "");

}
const editDocContent = async (urlEditor, data) => {

  const htmlEditor = await $.get(urlEditor);

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

  return { urlSubmitForm, paramsSaveDoc }

}
const saveDoc = async (urlSubmitForm, paramsSaveDoc, current, total) => (
  $.ajax({
    method: 'POST',
    url: urlSubmitForm,
    data: paramsSaveDoc
  }).done(htmlConfirmDoc => {
    !aborted && $('#progress').html(`<p style="text-align:center">${current}/${total}</p>`);
  }
  ));


export const abortAjax = () => {
  aborted = true;
  $('#cancelExecute').hide();
  $('#progress').html(`<p style="text-align:center">Cancelando progresso</p>`)
}

