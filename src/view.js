import ViewModal from './viewModal';
import ViewFriendrequestToggle from './viewFriendrequestToggle';
import ViewFriendPopover from './viewFriendPopover';

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
    this.$searchInput = document.querySelector('input');
    this.$searchResult = document.querySelector('.search__result');
    this.$friendList = document.querySelector('.friend-list');
    this.modal = new ViewModal({
      modal: document.querySelector('.modal'),
      toggle: this.$signInButton,
    });
    this.friendrequestsToggle = new ViewFriendrequestToggle({
      toggle: document.querySelector('.friendrequest-toggle'),
      badge: document.querySelector('.friendrequest-badge'),
    });
    this.friendPopover = new ViewFriendPopover({
      popover: document.querySelector('.friend-popover'),
    });

    this.modal.bindClose(this.closeModal.bind(this));
    this.friendrequestsToggle.bindToggle(this.toggleFriendrequestList.bind(this));
    this.$friendList.addEventListener('click', ({ target }) => {
      if (target.className !== 'friend__picture') return;

      const $friend = target.closest('.friend');
      const { offsetTop, offsetHeight } = $friend;
      const location = offsetTop + (offsetHeight / 2);
      const { id, nickname } = $friend.dataset;
      this.friendPopover.render({ id, nickname, location });
    });
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
   * @param {Function(RegExp)} handler Called when input value is changed
   */
  bindSearchUsers(handler) {
    this.$searchInput.addEventListener('input', async ({ target: { value } }) => {
      if (value === '') {
        this.$searchResult.classList.remove('search__result--active');
        return;
      }
      const regexp = new RegExp(`^${value}`);

      this.$searchResult.classList.add('search__result--active');
      this.$searchResult.classList.add('search__result--loading');
      handler(regexp);
    });
  }

  /**
   * @param {Function} handler Called when add button clicked in search result
   */
  bindRequestFriend(handler) {
    this.$searchResult.addEventListener('click', ({ target }) => {
      if (target.tagName !== 'BUTTON') return;

      const $userItem = target.closest('.search__user-item');
      const userId = $userItem.dataset.id;

      handler(userId);
    });
  }

  /**
   * @param {Function(string)} handler Called when remove button is clicked
   */
  bindRemoveFriend(handler) {
    this.friendPopover.bindRemoveFriend(handler);
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
   * @param {Array} users array of user
   */
  renderSearchResults(users) {
    this.$searchResult.innerHTML = '';
    this.$searchResult.innerHTML = users.length === 0 ? this.template.resultNoItem() : users.reduce((results, user) => results + this.template.resultItem(user), '');
    this.$searchResult.classList.remove('search__result--loading');
  }

  /**
   * @param {Array} friends array of friend
   */
  renderFriends(friends) {
    this.$friendList.innerHTML = friends.reduce((renderedHTML, friend) => renderedHTML + this.template.friend(friend), '');
  }

  /**
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
    this.$friendList.innerHTML = '';
  }
}
