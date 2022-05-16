export const getURLExtensao = () => chrome.runtime.getURL("js/injector.js").toString.replace("js/injector.js", '');


export const getDocsArvore = () => {

  const select = $('#docModelo select');
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


  const urlArvore = $("#ifrArvore").contents().find("[id^='anchorAP']").attr('href');

  if (!urlArvore) {
    const arvore = $("#ifrArvore").contents().find('#divArvore div')
    let nomesDocsArvore = [];

    arvore.find('span').each(function () {
      const doc = {
        text: $(this).text(),
        title: $(this).attr('title')
      }
      if (doc.title) nomesDocsArvore.push(doc);
    });

    let resultado = '';
    nomesDocsArvore.forEach((doc) => {
      if (doc.title.startsWith('Documento Cancelado'))
        resultado += `<option value="${doc.text}" disabled>${doc.text} </option>`
      else
        resultado += `<option value="${doc.text}">${doc.text}</option>`
    })

    clearInterval(loadingInteval);
    select.removeAttr('disabled');
    select.children().remove();
    select.append(resultado);

  } else {

    $.get(urlArvore, function (html) {
      const htmlLines = html.split('\n')
      const dataDocs = [];
      const regexTestLine = /^Nos\[\d\d?\d?] = new infraArvoreNo\("DOCUMENTO/;
      htmlLines.forEach((line) => {
        if (regexTestLine.test(line)) {
          const props = line.slice(line.indexOf('(') + 1).replaceAll(`"`, ``).replaceAll(`\\\\`).split(',');
          console.log(props)

          if (props[17])//documentos com vírgula têm quebra de linha por conta do split. Esta condição concatena as linhas quebradas
            dataDocs.push({
              nome: `${props[5]},${props[6]}`,
              numero: props[17],
              cancelado: props[7].startsWith('Documento Cancelado') ? true : false,
              externo: props[9].includes('sei_documento_interno') ? false : true
            });
          else
            dataDocs.push({
              nome: props[5],
              numero: props[15],
              cancelado: props[6].startsWith('Documento Cancelado') ? true : false,
              externo: props[9].includes('sei_documento_interno') ? false : true
            });
        }
      })

      let resultado = '';
      dataDocs.forEach((doc) => {
        if (doc.cancelado || doc.externo)
          resultado += `<option value="${doc.nome}" disabled title="Documento Externo ou Cancelado">${doc.nome} </option>`
        else
          resultado += `<option value="${doc.nome}">${doc.nome}</option>`
      })

      select.removeAttr('disabled');
      select.children().remove();
      select.append(resultado);

    }).then(() => {
      clearInterval(loadingInteval);

    })
  }
}



// $.ajax({
//   url: urlArvore,
//   dataType: 'html'
// }).done(function (html) {
//   //let elementoArvore = $(html).find('#divArvore div');
//   //console.log(html)
//   console.log(html)
// })

// export const getDocsArvore = () => {

//   let elementoArvore;
//   let nomesDocsArvore = [];
//   let resultado = '';
//   let URL = '';

//   const populaSelect = (nomes) => {
//     nomes.forEach((doc) => {
//       if (doc.title.startsWith('Documento Cancelado'))
//         resultado += `<option value="${doc.text}" disabled>${doc.text} </option>`
//       else
//         resultado += `<option value="${doc.text}">${doc.text}</option>`
//     }, '')
//   }

//   const topmenu = $("#ifrArvore", parent.window.document).contents().find('#topmenu');
//   topmenu.find('a').each(function () {
//     if ($(this).attr('id').startsWith('anchorAP'))
//       URL = $(this).attr('href');
//   });

//   if (URL) {
//     console.log('loading');

//     $.ajax({ url: URL }).done(function (html) {
//       elementoArvore = $(html).find('#divArvore div');
//       console.log(elementoArvore)
//       elementoArvore.find('span').each(function () {
//         const doc = {
//           text: $(this).text(),
//           title: $(this).attr('title')
//         }
//         if (doc.title) nomesDocsArvore.push(doc);
//       });

//       console.log('result -> ', nomesDocsArvore);
//       populaSelect(nomesDocsArvore);
//       console.log('done');
//     })

//   }
//   else {
//     elementoArvore = $("#ifrArvore", parent.window.document).contents().find('#divArvore div');
//     elementoArvore.find('span').each(function () {
//       const doc = {
//         text: $(this).text(),
//         title: $(this).attr('title')
//       }
//       if (doc.title) nomesDocsArvore.push(doc);
//     });

//     populaSelect(nomesDocsArvore);
//   }

//   console.log(nomesDocsArvore);

//   return resultado;
// }

export const clearInputs = () => $('.ui-dialog input').each(function () { $(this).val('') })

export const parseCSV = (file) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => console.log("Resultado:", results.data)
  })
}

export const abrirModal = (idModal) => $(idModal).dialog("open");


