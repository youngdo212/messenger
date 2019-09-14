export default class ViewAuthModal {
  /**
   * @param {Object} elements
   * @param {Element} elements.modal modal element
   * @param {Element} elements.toggle element to open modal
   */
  constructor({ modal, toggle }) {
    this.$modal = modal;
    this.$toggle = toggle;
    this.$modalContentContainer = modal.querySelector('.auth-modal__content-container');
    this.$modalContentSliderNext = modal.querySelector('.auth-modal__content-slider--next');
    this.$modalContentSliderBack = modal.querySelector('.auth-modal__content-slider--back');

    this.$toggle.addEventListener('click', () => {
      this.open();
    });
    this.$modalContentSliderNext.addEventListener('click', () => {
      this.$modalContentContainer.classList.add('auth-modal__content-container--next');
    });
    this.$modalContentSliderBack.addEventListener('click', () => {
      this.$modalContentContainer.classList.remove('auth-modal__content-container--next');
    });
  }

  /**
   * @param {Function} handler Called when clicking on modal background
   */
  bindClose(handler) {
    this.$modal.addEventListener('click', ({ target }) => {
      if (target.className !== this.$modal.className) return;

      handler();
    });
  }

  /**
   * open Modal
   */
  open() {
    this.$modal.classList.add('auth-modal--active');
  }

  /**
   * close Modal
   */
  close() {
    this.$modalContentContainer.classList.remove('auth-modal__content-container--next');
    this.$modal.classList.remove('auth-modal--active');
  }
}
