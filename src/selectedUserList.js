import template from './template.js'

export default class SelectedUserList {
  constructor({selectedUserList}) {
    this.$selectedUserList = selectedUserList;
    this.$selectedUserWrap = this.$selectedUserList.querySelector('.selected-user-wrap');
    this.$confirmButton = this.$selectedUserList.querySelector('.button--confirm');
    this.users = null;
    this.selectedUsers = [];
    this.loadUsers = null;
    this._registerAllEventListeners();
  }

  _registerAllEventListeners() {
    this.$selectedUserList.addEventListener('click', ({target}) => {
      if(target.tagName !== 'INPUT') return;

      const $selectedUser = target.closest('.selected-user');
      const userId = $selectedUser.dataset.id;
      
      target.checked ? this.selectUser(userId) : this.unselectUser(userId);
    })
  }

  onLoadUsers(callback) {
    this.loadUsers = callback;
  }

  onConfirmButtonClicked(callback) {
    this.$confirmButton.addEventListener('click', () => {
      callback(this.selectedUsers);
      this.close();
    })
  }

  open() {
    this.users = this.loadUsers();
    this.$selectedUserList.classList.add('selected-user-list--active');
    this.$selectedUserWrap.innerHTML = this.users.reduce((html, user) => html + template.selectedUser(user), '');
  }

  selectUser(userId) {
    const targetUser = this.users.find((user) => user._id === userId);
    this.selectedUsers = this.selectedUsers.concat(targetUser);
  }

  unselectUser(userId) {
    this.selectedUsers = this.selectedUsers.filter((user) => {
      return user._id !== userId;
    });
  }

  close() {
    this.users = null;
    this.selectedUsers = [];
    this.$selectedUserList.classList.remove('selected-user-list--active');
  }
}