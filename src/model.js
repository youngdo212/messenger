export default class Model {
  /**
   * @param {Messenger} messenger messenger sdk
   */
  constructor(messenger) {
    this.messenger = messenger;
    this.currentUser = null;
  }

  /**
   * @param {Function(User)} handler Called when friend signed in
   */
  onFriendPresenceChanged(handler) {
    this.currentUser.onFriendPresenceChanged(handler);
  }

  /**
   * @param {Function(Friendrequest)} handler Called when current user is requested friend
   */
  onFriendRequested(handler) {
    this.currentUser.onFriendRequested(handler);
  }

  /**
   * @param {CurrentUser} currentUser currentUser to insert
   * @param {function(Error, CurrentUser)} callback Called when currentUser is inserted or not
   */
  insertCurrentUser({ email, password, nickname }, callback) {
    this.messenger.createUser(email, password, nickname)
      .then((currentUser) => {
        callback(null, currentUser);
      })
      .catch((error) => {
        callback(error);
      });
  }

  /**
   *
   * @param {CurrentUser} currentUser currentUser to find
   * @param {function(Error, CurrentUser)} callback Called when currentUser is found or not
   */
  findCurrentUser({ email, password }, callback) {
    this.messenger.signIn(email, password)
      .then((currentUser) => {
        callback(null, currentUser);
      })
      .catch((error) => {
        callback(error);
      });
  }

  /**
   *
   * @param {CurrentUser} currentUser currentUser to set
   */
  setCurrentUser(currentUser) {
    this.currentUser = currentUser;
  }

  /**
   * @param {Friendrequest} friendrequest
   * @param {string} friendrequest.id friendrequest id
   * @param {string} friendrequest.answer 'accept' | 'decline'
   * @param {Function()} callback Called update is completed
   */
  updateFriendrequest({ id, answer }, callback) {
    this.currentUser.responseFriendrequest(id, answer)
      .then(() => {
        callback();
      });
  }

  /**
   * @param {Function} callback Function called when clearing currentUser
   */
  clearCurrentUser(callback) {
    this.messenger.signOut()
      .then(() => {
        callback();
      });
  }
}
