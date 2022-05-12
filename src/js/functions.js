export const getURLExtensao = () => chrome.runtime.getURL("js/injector.js").toString.replace("js/injector.js", '');


export const getDocsArvore = () => {
  const arvore = $("#ifrArvore", parent.window.document).contents().find('#divArvore div')
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
  }, '')


  return resultado;
}

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


