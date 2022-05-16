const BotaoMock = () => {

  $("body").append($(`<a id="trigger-modal" style="display: none"></a>`))

  $('#trigger-modal').click(() => {
    $('#docModelo').dialog('open');
  });
};

export default BotaoMock;