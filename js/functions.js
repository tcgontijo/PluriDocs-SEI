export const getDocsArvore = () => {
  const arvore = $("#ifrArvore", parent.window.document).contents().find('#divArvore div')
  let nomesDocsArvore = [];

  arvore.find('span').each(function () {
    const doc = {
      name: $(this).text(),
      title: $(this).attr('title')
    }
    if (doc.name) nomesDocsArvore.push(doc);
  });

  let resultado = '';
  nomesDocsArvore.forEach((doc) => {
    if (doc.title.startsWith('Documento Cancelado'))
      resultado += `<option value="${doc.name}" disabled>${doc.name} </option>`
    else
      resultado += `<option value="${doc.name}">${doc.name}</option>`
  }, '')


  return resultado;
}

export const clearInputs = () => $('.ui-dialog input').each(function () { $(this).val('') })