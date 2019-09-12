export default class Controller {
  /**
   * @param {!Model} model A model instance
   * @param {!View} view A View instance
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.bindCreateCurrentUser(this.createCurrentUser.bind(this));
    view.bindGetCurrentUser(this.getCurrentUser.bind(this));
    view.bindClearCurrentUser(this.clearCurrentUser.bind(this));
    view.bindUpdateFriendrequest(this.updateFriendrequest.bind(this));
    view.bindSearchUsers(this.searchUsers.bind(this));
    view.bindRequestFriend(this.requestFriend.bind(this));
    view.bindRemoveFriend(this.removeFriend.bind(this));
    view.bindMessageToFriend(this.messageToFriend.bind(this));
    view.bindOpenChat(this.openChat.bind(this));
  }

  /**
   * request to api server with cookie and set current user
   */
  init() {
    this.model.init((error, currentUser) => {
      if (error) return;
      if (!currentUser) return;
      this.setCurrentUser(currentUser);
    });
  }

  /**
   * @param {!string} email
   * @param {!string} password
   * @param {!string} nickname
   */
  createCurrentUser(email, password, nickname) {
    this.model.insertCurrentUser({
      email,
      password,
      nickname,
    }, (error, currentUser) => {
      if (error) return;

      this.view.closeModal();
      this.setCurrentUser(currentUser);
    });
  }

  /**
   * @param {!string} email
   * @param {!string} password
   */
  getCurrentUser(email, password) {
    this.model.findCurrentUser({
      email,
      password,
    }, (error, currentUser) => {
      if (error) return;

      this.view.closeModal();
      this.setCurrentUser(currentUser);
    });
  }

  /**
   * @param {CurrentUser} currentUser
   */
  async setCurrentUser(currentUser) {
    const { friendrequests } = currentUser;
    const friends = await currentUser.getFriends({ isPresent: 'desc' });
    const rooms = await currentUser.getRooms();

    // model setting
    this.model.setCurrentUser(currentUser);
    this.model.onFriendRequested((friendrequest) => {
      this.view.addFriendrequests([friendrequest]);
    });
    this.model.onFriendsUpdated(this.view.renderFriends.bind(this.view));
    this.model.onRoomsUpdated(this.view.renderRooms.bind(this.view));

    // view rendering
    this.view.renderCurrentUserInfo(currentUser);
    this.view.addFriendrequests(friendrequests);
    this.view.renderFriends(friends);
    this.view.renderRooms(rooms);
  }

  /**
   * clear current user
   */
  clearCurrentUser() {
    this.model.clearCurrentUser((error) => {
      if (error) {
        console.log(error);
        return;
      }

      this.view.clear();
    });
  }

  /**
   * @param {string} id friendrequest's id
   * @param {string} answer 'accept' | 'decline'
   */
  updateFriendrequest(id, answer) {
    this.model.updateFriendrequest({
      id,
      answer,
    }, () => {
      this.view.removeFriendrequest(id);
    });
  }

  /**
   * @param {RegExp} value
   */
  searchUsers(value) {
    this.model.findUsers({
      fields: ['email', 'nickname'],
      value,
    }, (users) => {
      this.view.renderSearchResults(users);
    });
  }

  /**
   * @param {string} userId
   */
  requestFriend(userId) {
    this.model.insertFriendrequest({
      to: userId,
    }, () => {
      console.log('request completed!');
    });
  }

  /**
   * @param {string} id friend id to remove
   */
  removeFriend(id) {
    this.model.deleteFriend({
      id,
    }, (error, friend) => {
      if (error) return;

      console.log(`${friend.nickname}님이 성공적으로 제거되었습니다`);
    });
  }

  /**
   * @param {string} id friend id to message
   */
  messageToFriend(id) {
    this.model.insertRoom({
      inviteUserIds: [id],
    }, (error, room) => {
      if (error) return;

      this.view.renderChat(room);
      this.view.setRoomSelected(room);
    });
  }

  /**
   * @param {string} roomId room id to open
   */
  openChat(roomId) {
    this.model.findRoom({
      id: roomId,
    }, (error, room) => {
      if (error) return;

      this.view.renderChat(room);
      this.view.setRoomSelected(room);
    });
  }
}
