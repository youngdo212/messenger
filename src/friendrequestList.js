import template from './template.js';

export default class FriendrequestList {
constructor({friendrequestList, toggle, badge}) {
    this.$friendrequestList = friendrequestList;
    this.$toggle = toggle;
    this.$friendrequestBadge = badge;
    this.friendrequests = {};
    this.length = 0;
    this.isOpened = false;
    this._registerAllEventListeners();
  }

  _registerAllEventListeners() {
    this.$toggle.addEventListener('click', (e) => {
      if(this.isOpened) return;

      this.open();
      e.stopPropagation();
    });

    this.$friendrequestList.addEventListener('click', (e) => {
    e.stopPropagation();
    if(e.target.tagName !== 'BUTTON') return;
      
      const answer = e.target.dataset.answer;
      const $friendrequest = e.target.closest('.friendrequest');
      
      this.response($friendrequest, answer);
      this.remove($friendrequest);
    });
  }

  open() {
    this.isOpened = true;
    this.$friendrequestList.classList.add('friendrequest-list--active');
    window.addEventListener('click', this.close.bind(this), {once: true});
  }

  close() {
    this.isOpened = false;
    this.$friendrequestList.classList.remove('friendrequest-list--active');
  }

  add(friendrequest) {
    this.friendrequests[friendrequest._id] = friendrequest;
    this.$friendrequestList.insertAdjacentHTML('beforeend', template.friendrequest(friendrequest));
    this.increase();
  }
  
  response($friendrequest, answer) {
    const friendrequest = this.friendrequests[$friendrequest.dataset.id];

    friendrequest[answer]().catch((error) => console.error.bind(console, error));
  }

  remove($friendrequest) {
    const friendrequestId = $friendrequest.dataset.id;

    this.$friendrequestList.removeChild($friendrequest);
    delete this.friendrequests[friendrequestId];
    this.decrease();
  }

  increase() {
    if(this.length === 0) this.$friendrequestBadge.classList.add('friendrequest-badge--active');
    
    this.$friendrequestBadge.textContent = ++this.length;
  }

  decrease() {
    if(this.length === 1) this.$friendrequestBadge.classList.remove('friendrequest-badge--active');

    this.$friendrequestBadge.textContent = --this.length;
  }
}