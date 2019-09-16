import { EventEmitter } from './helper';

export default class Model {
  /**
   * @param {Easychat} easychat easychat javascript sdk
   */
  constructor(easychat) {
    this.easychat = easychat;
    this.currentUser = null;
    this.openedRoomId = '';
    this.eventEmitter = new EventEmitter();
  }

  /**
   * @param {Function(Error[, CurrentUser])} callback
   */
  init(callback) {
    this.easychat.initializeApp()
      .then((currentUser) => {
        callback(null, currentUser);
      })
      .catch((error) => {
        callback(error);
      });
  }

  /**
   * @param {Function(User)} handler Called when friend signed in
   */
  onFriendPresenceChanged(handler) {
    this.currentUser.onFriendPresenceChanged(handler);
  }

  /**
   * @param {Function(Friendrequests)} handler Called when current user is requested friend
   */
  onFriendRequestsUpdated(handler) {
    const getFriendrequests = async () => {
      const friendrequests = await this.currentUser.getFriendrequests();
      handler(friendrequests);
    };

    this.currentUser.onFriendRequested(getFriendrequests);
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
   * @param {Function(Rooms)} handler Called when room is added, removed or room state changed
   */
  onRoomsUpdated(handler) {
    const getRooms = async () => {
      const rooms = await this.currentUser.getRooms();
      handler(rooms);
      this.eventEmitter.emit('rooms-updated');
    };

    this.currentUser.onRoomAdded(getRooms);
    this.currentUser.onRoomUpdated(getRooms);
    this.currentUser.onRoomRemoved(getRooms);
  }

  /**
   * @param {Function(Message)} handler Called when current user receive message
   */
  onMessage(handler) {
    this.currentUser.onMessage(handler);
  }

  /**
   * @param {CurrentUser} currentUser currentUser to insert
   * @param {function(Error, CurrentUser)} callback Called when currentUser is inserted or not
   */
  insertCurrentUser({ email, password, nickname }, callback) {
    this.easychat.createUser(email, password, nickname)
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
    this.easychat.signIn(email, password)
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
    const promises = fields.map((field) => this.easychat.getUsers(field, value));
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
   * @param {RoomOptions} roomOptions
   * @param {string[]} roomOptions.inviteUserIds user who is invited to room(except user who creates the room)
   * @param {Function(Error[, Room])} callback Called when room is inserted or not
   */
  insertRoom(roomOptions, callback) {
    this.currentUser.createRoom(roomOptions)
      .then((room) => {
        this.eventEmitter.once('rooms-updated', () => {
          callback(null, room);
        });
      })
      .catch((error) => {
        callback(error);
      });
  }

  /**
   * @param {Room} room
   * @param {string} room.id
   * @param {Function(Error, Room)} callback
   */
  findRoom({ id }, callback) {
    this.easychat.getRoom(id)
      .then((room) => {
        callback(null, room);
      })
      .catch((error) => {
        callback(error);
      });
  }

  /**
   * @param {Room} room
   * @param {string} room.roomId
   * @param {Object} room.hooks
   * @param {Function(message)} room.hooks.onMessage
   * @param {Function(room)} room.hooks.onUpdate
   * @param {Function(Error)} callback
   */
  insertRoomHook({ roomId, hooks }, callback) {
    this.openedRoomId = roomId;
    this.currentUser.openRoom({
      roomId,
      hooks,
    })
      .then(() => {
        callback(null);
      })
      .catch((error) => {
        callback(error);
      });
  }

  /**
   * Called when chat close
   */
  deleteRoomHook() {
    const roomId = this.openedRoomId;

    if (!roomId) return;

    this.currentUser.closeRoom(roomId);
    this.openedRoomId = '';
  }

  /**
   * @param {Message} message
   * @param {string} message.roomId
   * @param {string} message.text
   * @param {Function(Error)} callback
   */
  insertMessage({ roomId, text }, callback) {
    this.currentUser.sendMessage({
      roomId,
      text,
    })
      .then(() => {
        callback(null);
      })
      .catch((error) => {
        callback(error);
      });
  }

  /**
   * @param {Room} room
   * @param {string} room.id
   * @param {Function(Error)} callback Called when room is removed from current user
   */
  deleteRoom({ id }, callback) {
    this.currentUser.leaveRoom(id)
      .then(() => {
        callback(null);
      })
      .catch((error) => {
        callback(error);
      });
  }

  /**
   * @param {Function} callback Function called when clearing currentUser
   */
  clearCurrentUser(callback) {
    this.easychat.signOut()
      .then(() => {
        callback();
      });
  }

  /**
   * @param {Function(Error[, Array])} callback Called after find operation
   */
  findFriends(callback) {
    this.currentUser.getFriends()
      .then((friends) => {
        callback(null, friends);
      })
      .catch((error) => {
        callback(error);
      });
  }

  /**
   * @param {Object} room
   * @param {string[]} room.userIds inserted user id array
   * @param {Function(Error)} callback
   */
  insertRoomUsers({ userIds }, callback) {
    this.currentUser.addUsersToRoom({
      roomId: this.openedRoomId,
      userIds,
    })
      .then(() => {
        callback(null);
      })
      .catch((error) => {
        callback(error);
      });
  }
}
