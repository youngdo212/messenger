import template from './template.js';

export default class FriendList {
  constructor({friendlist}) {
    this.$friendList = friendlist;
    this.$selectedFriend = null;
    this.selectedFriendId = '';
    this.unselectWithThisBind = this.unselect.bind(this);
    this._registerAllEventListeners();
  }

  _registerAllEventListeners() {
    this.$friendList.addEventListener('click', (e) => {
      e.stopPropagation();

      if(e.target.className !== 'friend__picture') return;

      const $friend = e.target.closest('.friend')
      this.select($friend);
    })
  }

  onFriendRemoved(callback) {
    this.$friendList.addEventListener('click', (e) => {
      e.stopPropagation();

      if(e.target.tagName !== 'BUTTON') return;
      if(e.target.dataset.behavior !== 'remove') return;
      if(!confirm('정말 친구 관계를 끊으시겠습니까?')) return this.unselectAndRemoveListener();

      callback(this.selectedFriendId);
      this.unselectAndRemoveListener();
    })
  }

  // refactoring - duplication code above
  onRoomCreated(callback) {
    this.$friendList.addEventListener('click', (e) => {
      e.stopPropagation();

      if(e.target.tagName !== 'BUTTON') return;
      if(e.target.dataset.behavior !== 'message') return;

      callback(this.selectedFriendId);
      this.unselectAndRemoveListener();
    })
  }

  add(friend) {
    this.$friendList.insertAdjacentHTML('beforeend', template.friend(friend));
  }

  select($friend) {
    if(this.$selectedFriend === null) return this.selectFirst($friend);
    if(this.$selectedFriend === $friend) return this.unselectAndRemoveListener();

    this.unselect();
    $friend.classList.add('friend--selected');
    this.$selectedFriend = $friend;
    this.selectedFriendId = $friend.dataset.id;
  }

  selectFirst($friend) {
    $friend.classList.add('friend--selected');
    this.$selectedFriend = $friend;
    this.selectedFriendId = $friend.dataset.id;
    window.addEventListener('click', this.unselectWithThisBind, {once: true});
  }

  unselectAndRemoveListener() {
    this.unselect();
    window.removeEventListener('click', this.unselectWithThisBind, {once: true});
  }

  unselect() {
    this.$selectedFriend.classList.remove('friend--selected');
    this.$selectedFriend = null;
    this.selectedFriendId = '';
  }

  remove(friend) {
    const $friend = this.$friendList.querySelector(`.friend[data-id="${friend._id}"]`);
    this.$friendList.removeChild($friend);
  }
}