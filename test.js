function setNewDoc(id_procedimento, id_tipo_documento) {
  var href = url_host.replace('controlador.php', '') + 'controlador.php?acao=procedimento_trabalhar&id_procedimento=' + String(id_procedimento);
  $.ajax({ url: href }).done(function (html) {
    let $html = $(html);
    var urlArvore = $html.find("#ifrArvore").attr('src');
    $.ajax({ url: urlArvore }).done(function (htmlArvore) {
      var $htmlArvore = $(htmlArvore);
      var textLink = $htmlArvore.filter('script').not('[src*="js"]').text();
      var arrayLinksArvoreDoc = getLinksInText(textLink);
      var urlNewDoc = arrayLinksArvoreDoc.filter(function (v) { return v.indexOf('acao=documento_escolher_tipo') !== -1 });
      if (urlNewDoc) {
        $.ajax({ url: urlNewDoc }).done(function (htmlNewDoc) {
          let $htmlNewDoc = $(htmlNewDoc);
          var urlDoc = $htmlNewDoc.find('a[href*="&id_serie=' + id_tipo_documento + '"]').attr('href');
          console.log(urlDoc, id_tipo_documento);
          if (typeof urlDoc !== 'undefined') {
            $.ajax({ url: urlDoc }).done(function (htmlDoc) {
              var $htmlDoc = $(htmlDoc);
              var form = $htmlDoc.find('#frmDocumentoCadastro');
              var hrefForm = form.attr('action');
              var param = {};
              form.find("input[type=hidden]").each(function () {
                if ($(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                  param[$(this).attr('name')] = $(this).val();
                }
              });
              form.find('input[type=text]').each(function () {
                if ($(this).attr('id') && $(this).attr('id').indexOf('txt') !== -1) {
                  param[$(this).attr('id')] = $(this).val();
                }
              });
              form.find('select').each(function () {
                if ($(this).attr('id') && $(this).attr('id').indexOf('sel') !== -1) {
                  param[$(this).attr('id')] = $(this).val();
                }
              });
              form.find('input[type=radio]').each(function () {
                if ($(this).attr('name') && $(this).attr('name').indexOf('rdo') !== -1) {
                  param[$(this).attr('name')] = $(this).val();
                }
              });
              param.rdoNivelAcesso = '0';
              param.hdnFlagDocumentoCadastro = '2';
              param.txaObservacoes = '';
              param.txtDescricao = '';

              var postData = '';
              for (var k in param) {
                if (postData !== '') postData = postData + '&';
                var valor = (k == 'hdnAssuntos') ? param[k] : escapeComponent(param[k]);
                valor = (k == 'txtDataElaboracao') ? param[k] : escapeComponent(param[k]);
                valor = (k == 'hdnInteressados') ? param[k] : valor;
                valor = (k == 'txtDescricao') ? parent.encodeURI_toHex(param[k].normalize('NFC')) : valor;
                valor = (k == 'txtNumero') ? escapeComponent(param[k]) : valor;
                postData = postData + k + '=' + valor;
              }

              var xhr = new XMLHttpRequest();
              $.ajax({
                method: 'POST',
                // data: param,
                data: postData,
                url: hrefForm,
                contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
                xhr: function () {
                  return xhr;
                },
              }).done(function (htmlResult) {
                var status = (xhr.responseURL.indexOf('controlador.php?acao=arvore_visualizar&acao_origem=documento_gerar') !== -1) ? true : false;
                var ifrArvore = $('#ifrArvore');
                if (status) {
                  console.log('Documento gerado com sucesso');
                  var $htmlResult = $(htmlResult);
                  var urlEditor = [];
                  var idUser = false;
                  $.each($htmlResult.text().split('\n'), function (i, v) {
                    if (v.indexOf("atualizarArvore('") !== -1) {
                      urlReload = v.split("'")[1];
                    }
                    if (v.indexOf("acao=editor_montar") !== -1) {
                      urlEditor.push(v.split("'")[1]);
                    }
                    if (v.indexOf("janelaEditor_") !== -1) {
                      idUser = v.split("_")[1];
                    }
                  });
                  if (urlEditor.length > 0 && idUser) {
                    openLinkNewTab(href);
                    openWindowEditor(urlEditor[0] + '#&acao_pro=set_new_doc', idUser);
                  }
                  if (ifrArvore.length) {
                    if (urlReload) {
                      ifrArvore.attr('src', urlReload);
                    } else {
                      ifrArvore[0].contentWindow.location.reload(true);
                    }
                  }
                } else {
                  alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao gerar o documento.');
                }
              });
            });
          } else {
            alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao selecionar o tipo de documento. Verifique se o tipo est\u00E1 dispon\u00EDvel no sistema e tente novamente');
          }
        });
      } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!')
      }
    });
  });
}

/*
hdnInfraTipoPagina: 2
txtDataElaboracao: 24/05/2022
rdoTextoInicial: D
txtProtocoloDocumentoTextoBase: 46850977
selTextoPadrao: null
hdnIdDocumentoTextoBase: 
txtNumero: 
txtDescricao: 
txtRemetente: 
hdnIdRemetente: 
txtInteressado: 
hdnIdInteressado: 
txtDestinatario: 
hdnIdDestinatario: 
txtAssunto: 
hdnIdAssunto: 
txaObservacoes: 
selGrauSigilo: null
rdoNivelAcesso: 0

HIDDEN

hdnFlagDocumentoCadastro: 2
hdnAssuntos: 
hdnInteressados: 
hdnDestinatarios: 
hdnIdSerie: 11
hdnIdUnidadeGeradoraProtocolo: 110000785
hdnStaDocumento: I
hdnIdTipoConferencia: 
hdnStaNivelAcessoLocal: 
hdnIdHipoteseLegal: 
hdnStaGrauSigilo: 
hdnIdDocumento: 
hdnIdProcedimento: 53828072
hdnAnexos: 
hdnIdHipoteseLegalSugestao: 
hdnIdTipoProcedimento: 100000647
hdnUnidadesReabertura: 
hdnSinBloqueado: N
hdnContatoObject: 
hdnContatoIdentificador: 
hdnAssuntoIdentificador: */