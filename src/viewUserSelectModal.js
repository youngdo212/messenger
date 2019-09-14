export default class ViewUserSelectModal {
  /**
   * @param {Object} template template object containing functions
   * @param {Object} elements
   * @param {Element} elements.modal
   */
  constructor(template, { modal }) {
    this.template = template;
    this.$modal = modal;
    this.$confirmButton = modal.querySelector('.user-select__confirm-button');
    this.$userList = modal.querySelector('.user-select__user-list');
    this.$selectedUserList = modal.querySelector('.user-select__selected-user-list');
    this.handleConfirm = null;

    this.$userList.addEventListener('click', ({ target }) => {
      const $user = target.closest('.user-select__user');

      if (!$user) return;

      const { id } = $user.dataset;
      const nickname = $user.querySelector('.user-select__user-nickname').textContent;

      this.addSelectedUser(id, nickname);
    });

    this.$selectedUserList.addEventListener('click', ({ target }) => {
      if (target.tagName !== 'BUTTON') return;

      const $selectedUser = target.closest('.user-select__selected-user');

      this.$selectedUserList.removeChild($selectedUser);
    });
  }

  /**
   * @param {Function(string[])} handler Called with selected user id array
   */
  bindConfim(handler) {
    const handleConfirm = () => {
      const $selectedUsers = this.$selectedUserList.querySelectorAll('.user-select__selected-user');
      const selectedUserIds = Array.from($selectedUsers, ({ dataset: { id } }) => id);

      handler(selectedUserIds);
    };

    this.$confirmButton.addEventListener('click', handleConfirm);
    this.handleConfirm = handleConfirm;
  }

  /**
   * remove event handler on confirm button
   */
  unbindConfirm() {
    this.$confirmButton.removeEventListener('click', this.handleConfirm);
    this.handleConfirm = null;
  }

  /**
   * @param {Array} users array of user
   */
  render(users) {
    this.$modal.classList.add('modal--active');
    this.$userList.innerHTML = users.reduce((renderedHTML, user) => renderedHTML + this.template.userInUserSelect(user), '');
  }

  /**
   * clear modal
   */
  clear() {
    this.$modal.classList.remove('modal--active');
    this.$userList.innerHTML = '';
    this.$selectedUserList.innerHTML = '';
  }

  /**
   * add rendered user to selected user list
   */
  addSelectedUser(id, nickname) {
    const selectedUser = this.$selectedUserList.querySelector(`.user-select__selected-user[data-id="${id}"]`);

    if (selectedUser) return;

    this.$selectedUserList.insertAdjacentHTML('beforeend', this.template.selectedUserInUserSelect({
      id,
      nickname,
    }));
  }
}
