export default class ViewFriendrequestToggle {
  /**
   * @param {Object} elements
   * @param {Element} elements.toggle element to open and close friendrequest list
   * @param {Element} elements.badge counts the number of friendrequest
   */
  constructor({ toggle, badge }) {
    this.$toggle = toggle;
    this.$badge = badge;
  }

  /**
   * @param {Function} handler called on click event in toggle element
   */
  bindToggle(handler) {
    this.$toggle.addEventListener('click', () => {
      handler();
    });
  }

  /**
   * make toggle visible when current user sign in
   */
  active() {
    this.$toggle.classList.add('friendrequest-toggle--active');
  }

  /**
   * make toggle invisible when current user sign out
   */
  deactive() {
    this.$toggle.classList.remove('friendrequest-toggle--active');
  }

  /**
   * @param {Number} number The number of friendrequests that badge displays
   */
  setBadgeNumber(number) {
    if (number === 0) {
      this.$badge.classList.remove('friendrequest-badge--active');
    } else {
      this.$badge.classList.add('friendrequest-badge--active');
      this.$badge.textContent = number;
    }
  }
}
