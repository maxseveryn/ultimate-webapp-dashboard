const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modal-message");

let modalTimeout = null;

export function showModal(message, duration = 2000) {
  modalMessage.textContent = message;
  modal.style.display = "block";
  modal.classList.add("open");

  if (modalTimeout) clearTimeout(modalTimeout);

  modalTimeout = setTimeout(() => {
    hideModal();
  }, duration);
}

export function hideModal() {
  modal.style.display = "none";

  if (modalTimeout) {
    clearTimeout(modalTimeout);
    modalTimeout = null;
  }
}
