export default class ViewAuthModal {
  /**
   * @param {Object} elements
   * @param {Element} elements.modal modal element
   * @param {Element} elements.toggle element to open modal
   */
  constructor({ modal, toggle }) {
    this.$modal = modal;
    this.$toggle = toggle;
    this.$modalContentContainer = modal.querySelector('.carousel__inner');
    this.$modalContentSliderNext = modal.querySelector('.carousel__slider--next');
    this.$modalContentSliderBack = modal.querySelector('.carousel__slider--back');

    this.$toggle.addEventListener('click', () => {
      this.open();
    });
    this.$modalContentSliderNext.addEventListener('click', () => {
      this.$modalContentContainer.classList.add('carousel__inner--next');
    });
    this.$modalContentSliderBack.addEventListener('click', () => {
      this.$modalContentContainer.classList.remove('carousel__inner--next');
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
    this.$modal.classList.add('modal--active');
  }

  /**
   * close Modal
   */
  close() {
    this.$modalContentContainer.classList.remove('carousel__inner--next');
    this.$modal.classList.remove('modal--active');
  }
}
