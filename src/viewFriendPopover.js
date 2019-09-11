export default class ViewFriendPopover {
  /**
   * @param {Ojbect} element
   * @param {Element} element.popover
   */
  constructor({ popover }) {
    this.$popover = popover;
    this.$nickname = popover.querySelector('.friend-popover__nickname');
  }

  /**
   * @param {Function(string)} handler Called when remove button is clicked
   */
  bindRemoveFriend(handler) {
    this.$popover.addEventListener('click', ({ target }) => {
      if (target.dataset.behavior !== 'remove') return;

      const { userId } = this.$popover.dataset;
      this.clear();
      handler(userId);
    });
  }

  /**
   * @param {Friend} friend
   * @param {string} friend.id
   * @param {string} friend.nickname
   * @param {string} friend.location distance of friend element center to friend list element
   */
  render({ id, nickname, location }) {
    if (this.$popover.dataset.userId === id) {
      this.clear();
    } else {
      this.$popover.classList.add('friend-popover--active');
      this.$popover.style.top = `${location}px`;
      this.$popover.dataset.userId = id;
      this.$nickname.textContent = nickname;
    }
  }

  /**
   * clear popover nickname data-user-id and hide
   */
  clear() {
    this.$popover.classList.remove('friend-popover--active');
    this.$popover.dataset.userId = '';
    this.$nickname.textContent = '';
  }
}
