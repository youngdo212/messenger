import ViewModal from './viewModal';
import ViewFriendrequestToggle from './viewFriendrequestToggle';

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
    this.$friendrequestList = document.querySelector('.friendrequest-list');
    this.modal = new ViewModal({
      modal: document.querySelector('.modal'),
      toggle: this.$signInButton,
    });
    this.friendrequestsToggle = new ViewFriendrequestToggle({
      toggle: document.querySelector('.friendrequest-toggle'),
      badge: document.querySelector('.friendrequest-badge'),
    });

    this.modal.bindClose(this.closeModal.bind(this));
    this.friendrequestsToggle.bindToggle(this.toggleFriendrequestList.bind(this));
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
   * @param {Function()} handler Function called on sign out click event
   */
  bindClearCurrentUser(handler) {
    this.$signOutButton.addEventListener('click', () => {
      handler();
    });
  }

  /**
   * @param {Function(string, string)} handler Called when response button clicked in friendrequest
   */
  bindUpdateFriendrequest(handler) {
    this.$friendrequestList.addEventListener('click', ({ target }) => {
      if (target.tagName !== 'BUTTON') return;

      const { answer } = target.dataset;
      const $friendrequest = target.closest('.friendrequest');
      const { id } = $friendrequest.dataset;

      handler(id, answer);
    });
  }

  /**
   * @param {CurrentUser} currentUser
   */
  renderCurrentUserInfo(currentUser) {
    this.$currentUserInfo.innerHTML = this.template.currentUserInfo(currentUser);
    this.$signInButton.classList.remove('sign-in--active');
    this.$signOutButton.classList.add('sign-out--active');
    this.friendrequestsToggle.active();
  }

  /**
   * @param {Array} friendrequests array of friendrequest
   */
  addFriendrequests(friendrequests) {
    friendrequests.forEach((friendrequest) => {
      this.$friendrequestList.insertAdjacentHTML('beforeend', this.template.friendrequest(friendrequest));
    });
    this.friendrequestsToggle.setBadgeNumber(this.$friendrequestList.children.length);
  }

  /**
   * @param {string} id friendrequest id
   */
  removeFriendrequest(id) {
    const $friendrequest = this.$friendrequestList.querySelector(`[data-id="${id}"]`);
    this.$friendrequestList.removeChild($friendrequest);
    this.friendrequestsToggle.setBadgeNumber(this.$friendrequestList.children.length);
  }

  /**
   *
   * @param {Array} friends array of friend
   */
  renderFriends(friends) {
    console.log(friends);
  }

  /**
   *
   * @param {Array} rooms array of room
   */
  renderRooms(rooms) {
    console.log(rooms);
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
   * open or close friendrequest list
   */
  toggleFriendrequestList() {
    this.$friendrequestList.classList.toggle('friendrequest-list--active');
  }

  /**
   * clear all rendered contents and return to initial state (triggered when current user singed out)
   */
  clear() {
    this.$currentUserInfo.innerHTML = '';
    this.$signInButton.classList.add('sign-in--active');
    this.$signOutButton.classList.remove('sign-out--active');
    this.friendrequestsToggle.deactive();
    this.$friendrequestList.innerHTML = '';
    this.$friendrequestList.classList.remove('friendrequest-list--active');
  }
}
