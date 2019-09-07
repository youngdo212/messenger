export default class Model {
  /**
   * @param {Messenger} messenger messenger sdk
   */
  constructor(messenger) {
    this.messenger = messenger;
    this.currentUser = null;
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
    this.currentUser.onFriendPresenceChanged((friend) => {
      alert(`${friend.nickname} is ${friend.isPresent ? 'logined!' : 'logout:('}`);
    });
    this.currentUser.connect().catch((error) => {
      console.log(error);
    });
  }

  /**
   * @param {Function} callback Function called when clearing currentUser
   */
  clearCurrentUser(callback) {
    this.currentUser.disconnect()
      .then(() => {
        this.currentUser = null;
        callback();
      })
      .catch((error) => {
        callback(error);
      });
  }
}
