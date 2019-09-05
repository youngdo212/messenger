import template from "./template.js";

export default class Chat {
  constructor({chat}) {
    this.$chat = chat;
    this.$chatBody = this.$chat.querySelector('.chat__body');
    this.$roomName = this.$chat.querySelector('.chat__room-name');
    this.$userNumber = this.$chat.querySelector('.chat__user-number');
    this.$form = this.$chat.querySelector('.chat__form');
    this.$input = this.$chat.querySelector('.chat__input');
    this.$buttonLeaveRoom = this.$chat.querySelector('.button--leave-room');
    this.$buttonInviteUser = this.$chat.querySelector('.button--invite-user');
    this.currentRoom = null;
    this.openRoom = null;
    this.closeRoom = null;
  }

  onMessageSubmitted(callback) {
    this.$form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = this.$input.value;
      this.$input.value = '';

      if(text === '') return;

      callback({
        room: this.currentRoom,
        text: text,
      });
    });
  }

  onRoomOpened(callback) {
    this.openRoom = callback;
  }

  onRoomClosed(callback) {
    this.closeRoom = callback;
  }

  onLeaveRoomButtonClicked(callback) {
    this.$buttonLeaveRoom.addEventListener('click', () => {
      callback(this.currentRoom).catch(error => console.error.bind(console, error));
      this.closeRoom(this.currentRoom);
      this.$chatBody.innerHTML = '';
      this.$chat.classList.remove('chat--active');
      this.currentRoom = null;
    });
  }

  onInviteButtonClick(callback) {
    this.$buttonInviteUser.addEventListener('click', () => {
      callback();
    });
  }

  load(room) {
    this.currentRoom && this.closeRoom(this.currentRoom);
    this.render(room);
    this.openRoom(room, {
      onMessage: this.addMessage.bind(this),
      onUpdate: this.updateRoom.bind(this),
    });
    this.currentRoom = room;
  }

  render(room) {
    this.$chatBody.innerHTML = '';
    this.$chat.classList.add('chat--active');
    this.$roomName.textContent = room.users.map((user) => user.nickname).join(', ');
    this.$userNumber.textContent = room.users.length;
  }

  addMessage(message) {
    this.$chatBody.insertAdjacentHTML('beforeend', template.message(message));
  }

  updateRoom(room) {
    this.$roomName.textContent = room.users.map((user) => user.nickname).join(', ');
    this.$userNumber.textContent = room.users.length;
    this.currentRoom = room;
  }
  
  inviteUsers(users) {
    users.forEach((user) => {
      this.currentRoom.addUser(user._id);
    });
  }
}