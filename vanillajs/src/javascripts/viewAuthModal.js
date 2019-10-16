export default class ViewAuthModal {
  /**
   * @param {Object} elements
   * @param {Element} elements.modal modal element
   * @param {Element} elements.toggle element to open modal
   */
  constructor({ modal, toggle }) {
    this.$modal = modal;
    this.$modalContent = modal.querySelector('.modal__content');
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
    this.$modal.classList.remove('modal--hidden');
    this.$modal.classList.add('modal--visible');
    this.$modal.classList.add('modal--fade-in');
    this.$modal.addEventListener('animationstart', () => {
      this.$modalContent.classList.remove('modal__content--collapse');
    }, { once: true });
    this.$modal.addEventListener('animationend', ({ currentTarget }) => {
      currentTarget.classList.remove('modal--fade-in');
    }, { once: true });
  }

  /**
   * close Modal
   */
  close() {
    this.$modal.classList.add('modal--fade-out');
    this.$modalContent.classList.add('modal__content--collapse');
    this.$modal.addEventListener('animationend', ({ currentTarget }) => {
      currentTarget.classList.remove('modal--visible');
      currentTarget.classList.remove('modal--fade-out');
      currentTarget.classList.add('modal--hidden');
      this.$modalContentContainer.classList.remove('carousel__inner--next');
    }, { once: true });
  }
}
