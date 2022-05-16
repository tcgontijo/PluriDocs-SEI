const Modal = ({
  appentTo,
  children,
  idModal,
  options
}) => {
  $(appentTo).append(children)

  $(idModal).dialog(options);
}

export default Modal;