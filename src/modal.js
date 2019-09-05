export default class Modal {
  constructor({modal, openButton}) {
    this.$modal = modal;
    this.$openButton = openButton;
    this.$modalDialog = this.$modal.querySelector('.modal__dialog');
    this.$modalContentContainer = this.$modal.querySelector('.modal__content-container');
    this.$modalContentSliderNext = this.$modal.querySelector('.modal__content-slider--next');
    this.$modalContentSliderBack = this.$modal.querySelector('.modal__content-slider--back');
    this.$signUpForm = this.$modal.querySelector('.form--sign-up');
    this.$signUpInputEmail = this.$signUpForm.querySelector('input[name="email"]');
    this.$signUpInputPassword = this.$signUpForm.querySelector('input[name="password"]');
    this.$signUpInputNickname = this.$signUpForm.querySelector('input[name="nickname"]');
    this.$signInForm = this.$modal.querySelector('.form--sign-in');
    this.$signInInputEmail = this.$signInForm.querySelector('input[name="email"]');
    this.$signInInputPassword = this.$signInForm.querySelector('input[name="password"]');
    this._registerEventListeners();
  }

  _registerEventListeners() {
    this.$openButton.addEventListener('click', this.open.bind(this));
    this.$modalContentSliderNext.addEventListener('click', () => {
      this.$modalContentContainer.classList.add('modal__content-container--next');
    });
    this.$modalContentSliderBack.addEventListener('click', () => {
      this.$modalContentContainer.classList.remove('modal__content-container--next');
    });
  }
  
  open() {
    // naming 
    const checkOutside = ({target}) => {
      if(this.$modalDialog.contains(target)) return window.addEventListener('click', checkOutside, {
        once: true,
        capture: true,
      });
  
      this.close();
    };

    this.$modal.classList.add('modal--active');
    window.addEventListener('click', checkOutside, {
      once: true,
      capture: true,
    });
  }

  close() {
    this.$modalContentContainer.classList.remove('modal__content-container--next');
    this.$signInForm.reset();
    this.$signUpForm.reset();
    this.$modal.classList.remove('modal--active');
  }

  onUserCreated(callback) {
    this.$signUpForm.addEventListener('submit', (e) => {
      e.preventDefault();
    
      const email = this.$signUpInputEmail.value;
      const password = this.$signUpInputPassword.value;
      const nickname = this.$signUpInputNickname.value;
    
      callback(email, password, nickname)
        .then(this.close.bind(this))
        .catch((error) => console.error.bind(console, error));
    });
  }

  onUserSignedIn(callback) {
    this.$signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
    
      const email = this.$signInInputEmail.value;
      const password = this.$signInInputPassword.value;
    
      callback(email, password)
      .then(this.close.bind(this))
      .catch((error) => console.error.bind(console, error));
    });
  }
}