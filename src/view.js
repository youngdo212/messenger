import ViewModal from './viewModal';

export default class View {
  /**
   * @param {Object} template template object containing functions
   */
  constructor(template) {
    this.template = template;
    this.$signUpForm = document.querySelector('.form--sign-up');
    this.$signInForm = document.querySelector('.form--sign-in');
    this.$currentUserInfo = document.querySelector('.current-user-info');
    this.$signInButton = document.querySelector('.sign-in');
    this.$signOutButton = document.querySelector('.sign-out');
    this.modal = new ViewModal({
      modal: document.querySelector('.modal'),
      toggle: this.$signInButton,
    });

    this.modal.bindClose(this.closeModal.bind(this));
  }

  /**
   * @param {Function} handler Function called on submit event.
   */
  bindCreateCurrentUser(handler) {
    this.$signUpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const $form = e.target;
      const $inputs = $form.querySelectorAll('input');
      const inputValues = Array.from($inputs, ($input) => $input.value);

      handler(...inputValues);
    });
  }

  /**
   * @param {Function} handler Function called on submit event
   */
  bindGetCurrentUser(handler) {
    this.$signInForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const $form = e.target;
      const $inputs = $form.querySelectorAll('input');
      const inputValues = Array.from($inputs, ($input) => $input.value);

      handler(...inputValues);
    });
  }

  /**
   *
   * @param {Functioin} handler Function called on sign out click event
   */
  bindClearCurrentUser(handler) {
    this.$signOutButton.addEventListener('click', () => {
      handler();
    });
  }

  /**
   * @param {CurrentUser} currentUser
   */
  renderCurrentUserInfo(currentUser) {
    this.$currentUserInfo.innerHTML = this.template.currentUserInfo(currentUser);
    this.$signInButton.classList.remove('sign-in--active');
    this.$signOutButton.classList.add('sign-out--active');
  }

  /**
   * close modal and reset form data
   */
  closeModal() {
    this.modal.close();
    this.$signInForm.reset();
    this.$signUpForm.reset();
  }

  /**
   * clear all rendered contents and return to initial state (triggered when current user singed out)
   */
  clear() {
    this.$currentUserInfo.innerHTML = '';
    this.$signInButton.classList.add('sign-in--active');
    this.$signOutButton.classList.remove('sign-out--active');
  }
}
