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
    view.bindSendMessage(this.sendMessage.bind(this));
    view.bindLeaveRoom(this.leaveRoom.bind(this));
    view.bindInviteUserToRoom(this.inviteUserToRoom.bind(this));
    view.bindOpenUserSelect(this.openUserSelect.bind(this));
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
    const friendrequests = await currentUser.getFriendrequests();
    const friends = await currentUser.getFriends({ isPresent: 'desc' });
    const rooms = await currentUser.getRooms();

    // model setup
    this.model.setCurrentUser(currentUser);
    this.model.onFriendRequestsUpdated(this.view.renderFriendrequests.bind(this.view));
    this.model.onFriendsUpdated(this.view.renderFriends.bind(this.view));
    this.model.onRoomsUpdated(this.view.renderRooms.bind(this.view));
    this.model.onMessage((message) => {
      console.log(message);
    });

    // view rendering
    this.view.renderCurrentUser(currentUser);
    this.view.renderFriendrequests(friendrequests);
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
      addUserIds: [id],
    }, (error, room) => {
      if (error) return;

      this.view.clearChat();
      this.view.renderChat(room);
      this.view.setRoomSelected(room);
      this.cancelAllSubscription();
      this.subscribeToRoom(room);
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

      this.view.clearChat();
      this.view.renderChat(room);
      this.view.setRoomSelected(room);
      this.cancelAllSubscription();
      this.subscribeToRoom(room);
    });
  }

  /**
   * @param {Room} room
   */
  subscribeToRoom(room) {
    this.model.insertRoomHook({
      roomId: room._id,
      hooks: {
        onMessage: this.view.addMessage.bind(this.view),
        onUpdate: this.view.renderChat.bind(this.view),
      },
    }, (error) => {
      if (error) return;
      console.log('hook is attached');
    });
  }

  /**
   * Called when select another room or sign out
   */
  cancelAllSubscription() {
    this.model.deleteRoomHook();
  }

  /**
   * @param {string} roomId
   * @param {string} text
   */
  sendMessage(roomId, text) {
    this.model.insertMessage({
      roomId,
      text,
    }, (error) => {
      if (error) return;
      console.log(`message is sent : ${text}`);
    });
  }

  /**
   * @param {string} roomId
   */
  leaveRoom(roomId) {
    this.model.deleteRoom({
      id: roomId,
    }, (error) => {
      if (error) console.log(error);

      this.view.clearChat();
      this.cancelAllSubscription();
    });
  }

  /**
   * @param {string[]} userIds
   */
  inviteUserToRoom(userIds) {
    this.model.insertRoomUsers({
      userIds,
    }, (error) => {
      if (error) console.log(error);
    });
  }

  /**
   * Called when chat invite button is clicked
   */
  openUserSelect() {
    this.model.findFriends((error, friends) => {
      if (error) return;

      this.view.renderUserSelect(friends);
    });
  }
}
