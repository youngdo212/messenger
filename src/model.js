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
   * @param {Function(Friends)} handler Called when friend is added, removed or friend presence changed
   */
  onFriendsUpdated(handler) {
    const getFriends = async () => {
      const friends = await this.currentUser.getFriends({ isPresent: 'decs' });
      handler(friends);
    };

    this.currentUser.onFriendAdded(getFriends);
    this.currentUser.onFriendPresenceChanged(getFriends);
    this.currentUser.onFriendRemoved(getFriends);
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
   * @param {Object} query
   * @param {Array} query.fields 'email' | 'nickname' or both
   * @param {RegExp} query.value
   * @param {Function(Array)} callback Called with users when all users are found
   */
  findUsers({ fields, value }, callback) {
    const promises = fields.map((field) => this.messenger.getUsers(field, value));
    Promise.all(promises)
      .then((users) => {
        const flattedUsers = users.flat();
        const usersWithoutDuplication = flattedUsers.filter((user, index) => (flattedUsers.findIndex((e) => e.email === user.email) >= index));
        callback(usersWithoutDuplication);
      });
  }

  /**
   * @param {Object} friendrequest
   * @param {string} friendrequest.to The user id Who current user want to request friend to
   * @param {Function()} callback Called when friendrequest is inserted seccessfully
   */
  insertFriendrequest({ to }, callback) {
    this.currentUser.requestFriend(to)
      .then(() => {
        callback();
      });
  }

  /**
   * @param {Friend} friend
   * @param {string} friend.id friend id to remove
   * @param {Function(Error, Friend)} callback Called with removed friend when the friend is removed
   */
  deleteFriend({ id }, callback) {
    this.currentUser.removeFriend(id)
      .then((removedFriend) => {
        callback(null, removedFriend);
      })
      .catch((error) => {
        callback(error);
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
