let dataDocs = [];
let urlLocal = '';
let dynamicFields = [];
let CSVData = [];
let CSVHeaders = [];

let selectedModel = {};
let CSVFileName = '';

export const getURLExtensao = () => chrome.runtime.getURL("js/injector.js").toString.replace("js/injector.js", '');

const fillSelect = (select) => {
  let resultado = '';
  dataDocs.forEach((doc) => {
    if (doc.cancelado || doc.externo)
      resultado += `<option value="${doc.nome}" disabled title="Documento externo, cancelado ou e-mail">${doc.nome} </option>`
    else
      resultado += `<option value="${doc.nome}">${doc.nome}</option>`
  })
  select.removeAttr('disabled');
  select.children().remove();
  select.append(resultado);
}

export const getDocsArvore = () => {

  const select = $('#docModelo select');

  if (window.location.href === urlLocal) {
    fillSelect(select)
    $("#btnSelecaoDoc").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled')
  } else {
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

    }).then(() => $("#btnSelecaoDoc").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled'))
    urlLocal = window.location.href;
  }
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
    const matches = Array.from(new Set(body.match(/##.+##/gmi)));//rearranjo para remover duplicatas
    //const pureFields = matches.map((word) => word.replaceAll('#', ''))
    fillModelAnalysis(matches, selectedDoc);
  }).then(() => {
    $("#loaderAnalysis").remove();
  })
}

const fillModelAnalysis = (matches, selectedDoc) => {

  selectedModel = selectedDoc;
  dynamicFields = matches.map((field) => field.toLocaleLowerCase().trim());

  $('#analiseDocModelo').append(`<div id='fieldList'></div>`)
  $('#fieldList').append(`<p class="textAnalysis"><span class='ui-icon ui-icon-arrow-r'></span> Docuemento: ${selectedDoc.nome}</p>`)
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
    skipEmptyLines: true,
    complete: (results) => {
      fillCSVAnalysis(results, file.name);
    }
  })
  $("#loaderAnalysisCSV").remove();
}

const fillCSVAnalysis = (parseData, filename) => {

  CSVFileName = filename;
  CSVData = parseData.data;
  CSVHeaders = Object.keys(CSVData[0]).map((header) => header.toLocaleLowerCase().trim());

  $('#analiseCSV').append(`<div id='fieldListCSV'></div>`)
  $('#fieldListCSV').append(`<p class="textAnalysis"><span class='ui-icon ui-icon-arrow-r'></span> Arquivo: ${filename}</p>`)
  if (CSVHeaders.length) {
    let lista = `<ul class="textAnalysis">\n`;
    CSVHeaders.forEach((field) => {
      lista += `<li>${field}</li>\n`
    })
    lista += '</ul>';
    $('#fieldListCSV').append(`<p class="textAnalysis dFielTitle"><span class='ui-icon ui-icon-arrowreturn-1-s curvedArrow'></span> Cabeçalhos detectados:</p>`)
    $('#fieldListCSV').append(lista);
    $('#fieldListCSV').append(`<p class="textAnalysis dFielTitle"><span class='ui-icon ui-icon-arrowreturn-1-s curvedArrow'></span> Quantidade de registros: ${CSVData.length}</p>`)
    $("#btnConfirmAnalysis").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
  } else {
    $('#fieldListCSV').append(`<small class="noFieldsError">Não foi identificado nenhum cabeçalho no arquivo enviado. Verifique se a planilha não está vazia.</small>`)
  }
}

export const printDataCrossing = () => {
  $('#divTableDataCrossing').remove();
  $('#cruzData .noFieldsError').remove();

  const cleanFields = dynamicFields.map((field) => field.replaceAll('#', ''))
  const dataCrossing = []
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
    let selectData = ''
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
          <select>${selectData}</select>
          <small>*Alguns documentos possuem a propriedade <b>Número</b> que quando preenchida exibe o valor na árvore de processos logo após o tipo. Exemplo: Anexo Contrato (Anexo = tipo e Contrato=Número)</small>
        </div>
        <hr style="all:revert">
        <div id="checkDeleteModel">
          <input type="checkbox" checked>
          <p id="labelCheckDeleteModel">Excluir Documento Modelo após procedimento</p>
        </div>
      </div>
    `)

  }
}

export const execute = () => {
  const urlNewDoc = $('#ifrVisualizacao').contents().find("img[title='Incluir Documento'").parent().attr('href');

  $.get(urlNewDoc).done((htmlChooseDocType) => {
    //console.log(htmlChooseDocType)
    const urlExpandDocList = $(htmlChooseDocType).find('#frmDocumentoEscolherTipo').attr('action')
    $.ajax({
      method: 'POST',
      url: urlExpandDocList,
      data: { hdnFiltroSerie: 'T' }
    }).done((htmlExpandedDocList) => {

      const htmlTypeList = $(htmlExpandedDocList).find('.ancoraOpcao')

      let typeList = []
      for (let i = 0; i < htmlTypeList.length; i++) {
        typeList.push({
          nome: htmlTypeList[i].textContent,
          url: htmlTypeList[i].getAttribute("href")
        })
      }

      let matchedType = {};
      typeList.some((type) => {
        if (selectedModel.nome.startsWith(type.nome)) {
          matchedType = type;
          return true;
        }
      })


      $.get(matchedType.url).done((htmlFormNewDoc) => {

        const urlConfirmDocData = $(htmlFormNewDoc).find('#frmDocumentoCadastro').attr('action');

        

        $.ajax({
          method: 'POST',
          url: urlConfirmDocData,
          data: {
            rdoNivelAcesso: 0,
            //txtNumero: "Nome na árvore",
            txtProtocoloDocumentoTextoBase: selectedModel.numero,
          }
        }).done((html) => {
          console.log(html)



        })




      })
    })
  })
}
