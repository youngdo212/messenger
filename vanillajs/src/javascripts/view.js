import ViewAuthModal from './viewAuthModal';
import ViewUserSelectModal from './viewUserSelectModal';
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
    this.$currentUser = document.querySelector('.current-user');
    this.$signInButton = document.querySelector('.menu__item--sign-in');
    this.$signOutButton = document.querySelector('.menu__item--sign-out');
    this.$friendrequestList = document.querySelector('.friendrequest-list');
    this.$searchInput = document.querySelector('input');
    this.$searchResult = document.querySelector('.search__result');
    this.$friendList = document.querySelector('.friend-list');
    this.$roomList = document.querySelector('.room-list');
    this.$chat = document.querySelector('.chat');
    this.$chatBody = this.$chat.querySelector('.chat__body');
    this.$chatName = this.$chat.querySelector('.chat__room-name');
    this.$chatUserNumber = this.$chat.querySelector('.chat__user-number');
    this.$chatForm = this.$chat.querySelector('.chat__form');
    this.$chatInput = this.$chat.querySelector('.chat__input');
    this.$chatLeaveButton = this.$chat.querySelector('.chat__room-option--action-leave');
    this.$chatInviteButton = this.$chat.querySelector('.chat__room-option--action-invite');
    this.authModal = new ViewAuthModal({
      modal: document.querySelector('.modal--auth'),
      toggle: this.$signInButton,
    });
    this.userSelectModal = new ViewUserSelectModal(
      template,
      {
        modal: document.querySelector('.modal--user-select'),
      },
    );
    this.friendrequestsToggle = new ViewFriendrequestToggle({
      toggle: document.querySelector('.menu__item--friendrequests'),
      badge: document.querySelector('.menu__badge--for-friendrequests'),
    });
    this.friendPopover = new ViewFriendPopover({
      popover: document.querySelector('.friend-popover'),
    });
    this.handleInviteUserToRoom = null;

    this.authModal.bindClose(this.closeModal.bind(this));
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
   * @param {Function(string)} handler Called when message button is clicked
   */
  bindMessageToFriend(handler) {
    this.friendPopover.bindMessageToFriend(handler);
  }

  /**
   * @param {Function(string)} handler Called when room is clicked
   */
  bindOpenChat(handler) {
    this.$roomList.addEventListener('click', ({ target }) => {
      const $room = target.closest('.room');

      if (!$room) return;
      if ($room.classList.contains('room--selected')) return;

      handler($room.dataset.id);
    });
  }

  /**
   *
   * @param {Function(string, string)} handler Called when chat form is submitted
   */
  bindSendMessage(handler) {
    this.$chatForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const text = this.$chatInput.value;
      const { roomId } = this.$chat.dataset;

      if (!text || !roomId) return;

      this.$chatInput.value = '';
      this.$chatBody.scrollTop = this.$chatBody.scrollHeight - this.$chatBody.clientHeight;
      handler(roomId, text);
    });
  }

  /**
   * @param {Function(string)} handler Called when leave button in chat is clicked
   */
  bindLeaveRoom(handler) {
    this.$chatLeaveButton.addEventListener('click', () => {
      const { roomId } = this.$chat.dataset;
      handler(roomId);
    });
  }

  /**
   * @param {Function(string[])} handler Called when confirm button clicked in view.userSelectModal
   */
  bindInviteUserToRoom(handler) {
    this.handleInviteUserToRoom = handler;
  }

  /**
   * @param {Function} handler Called when invite button in chat clicked
   */
  bindOpenUserSelect(handler) {
    this.$chatInviteButton.addEventListener('click', () => {
      this.userSelectModal.bindConfim((selectedUserIds) => {
        if (selectedUserIds.length) this.handleInviteUserToRoom(selectedUserIds);
        this.closeUserSelect();
      });
      handler();
    });
  }


  /**
   * @param {CurrentUser} currentUser
   */
  renderCurrentUser(currentUser) {
    this.$currentUser.innerHTML = this.template.currentUser(currentUser);
    this.$currentUser.classList.remove('menu__item--theme-hide');
    this.$signInButton.classList.add('menu__item--theme-hide');
    this.$signOutButton.classList.remove('menu__item--theme-hide');
    this.friendrequestsToggle.active();
  }

  /**
   * @param {Array} friendrequests array of friendrequest
   */
  renderFriendrequests(friendrequests) {
    this.$friendrequestList.innerHTML = friendrequests.reduce((renderedHTML, friendrequest) => {
      const renderedFriendrequest = this.template.friendrequest(friendrequest);
      return renderedHTML + renderedFriendrequest;
    }, '');
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
   * keep selected room id and render all new rooms. and set the room selected
   * @param {Array} rooms array of room
   */
  renderRooms(rooms) {
    const $selectedRoom = this.$roomList.querySelector('.room--selected');
    const selectedRoomId = $selectedRoom ? $selectedRoom.dataset.id : '';

    this.$roomList.innerHTML = rooms.reduce((renderedHTML, room) => renderedHTML + this.template.room(room), '');
    if (selectedRoomId) this.setRoomSelected({ _id: selectedRoomId });
  }

  /**
   * @param {Room} room
   */
  renderChat(room) {
    this.$chat.classList.add('chat--active');
    this.$chat.dataset.roomId = room._id;
    this.$chatName.textContent = room.users.map((user) => user.nickname).join(', ');
    this.$chatUserNumber.textContent = room.users.length;
    this.$chatInput.value = '';
    this.$chatInput.focus();
  }

  /**
   * clear chat content
   */
  clearChat() {
    this.$chat.classList.remove('chat--active');
    this.$chat.dataset.roomId = '';
    this.$chatBody.innerHTML = '';
    this.$chatName.textContent = '';
    this.$chatUserNumber.textContent = '';
    this.$chatInput.value = '';
    this.$chatInput.blur();
  }

  /**
   * @param {Room} room
   * @param {string} room._id
   */
  setRoomSelected({ _id }) {
    const $rooms = this.$roomList.querySelectorAll('.room');

    $rooms.forEach(($room) => {
      if ($room.dataset.id !== _id) $room.classList.remove('room--selected');
      else $room.classList.add('room--selected');
    });
  }

  /**
   * @param {Message} message
   */
  addMessage(message) {
    const isScrolled = this.$chatBody.scrollTop < this.$chatBody.scrollHeight - this.$chatBody.clientHeight;

    this.$chatBody.insertAdjacentHTML('beforeend', this.template.message(message));
    if (!isScrolled) this.$chatBody.scrollTop = this.$chatBody.scrollHeight - this.$chatBody.clientHeight;
  }

  /**
   * close modal and reset form data
   */
  closeModal() {
    this.authModal.close();
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
   * @param {Array} users
   */
  renderUserSelect(users) {
    this.userSelectModal.render(users);
  }

  /**
   * Called when user select is confirmed
   */
  closeUserSelect() {
    this.userSelectModal.clear();
    this.userSelectModal.unbindConfirm();
  }

  /**
   * clear all rendered contents and return to initial state (triggered when current user singed out)
   */
  clear() {
    this.$currentUser.innerHTML = '';
    this.$currentUser.classList.add('menu__item--theme-hide');
    this.$signInButton.classList.remove('menu__item--theme-hide');
    this.$signOutButton.classList.add('menu__item--theme-hide');
    this.friendrequestsToggle.deactive();
    this.$friendrequestList.innerHTML = '';
    this.$friendrequestList.classList.remove('friendrequest-list--active');
    this.$friendList.innerHTML = '';
    this.$roomList.innerHTML = '';
    this.clearChat();
  }
}
