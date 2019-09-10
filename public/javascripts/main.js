/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/chat.js":
/*!*********************!*\
  !*** ./src/chat.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Chat; });\n/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template */ \"./src/template.js\");\n\n\nclass Chat {\n  constructor({ chat }) {\n    this.$chat = chat;\n    this.$chatBody = this.$chat.querySelector('.chat__body');\n    this.$roomName = this.$chat.querySelector('.chat__room-name');\n    this.$userNumber = this.$chat.querySelector('.chat__user-number');\n    this.$form = this.$chat.querySelector('.chat__form');\n    this.$input = this.$chat.querySelector('.chat__input');\n    this.$buttonLeaveRoom = this.$chat.querySelector('.button--leave-room');\n    this.$buttonInviteUser = this.$chat.querySelector('.button--invite-user');\n    this.currentRoom = null;\n    this.openRoom = null;\n    this.closeRoom = null;\n  }\n\n  onMessageSubmitted(callback) {\n    this.$form.addEventListener('submit', (e) => {\n      e.preventDefault();\n      const text = this.$input.value;\n      this.$input.value = '';\n\n      if (text === '') return;\n\n      callback({\n        room: this.currentRoom,\n        text,\n      });\n    });\n  }\n\n  onRoomOpened(callback) {\n    this.openRoom = callback;\n  }\n\n  onRoomClosed(callback) {\n    this.closeRoom = callback;\n  }\n\n  onLeaveRoomButtonClicked(callback) {\n    this.$buttonLeaveRoom.addEventListener('click', () => {\n      callback(this.currentRoom).catch((error) => console.error.bind(console, error));\n      this.closeRoom(this.currentRoom);\n      this.$chatBody.innerHTML = '';\n      this.$chat.classList.remove('chat--active');\n      this.currentRoom = null;\n    });\n  }\n\n  onInviteButtonClick(callback) {\n    this.$buttonInviteUser.addEventListener('click', () => {\n      callback();\n    });\n  }\n\n  load(room) {\n    this.currentRoom && this.closeRoom(this.currentRoom);\n    this.render(room);\n    this.openRoom(room, {\n      onMessage: this.addMessage.bind(this),\n      onUpdate: this.updateRoom.bind(this),\n    });\n    this.currentRoom = room;\n  }\n\n  render(room) {\n    this.$chatBody.innerHTML = '';\n    this.$chat.classList.add('chat--active');\n    this.$roomName.textContent = room.users.map((user) => user.nickname).join(', ');\n    this.$userNumber.textContent = room.users.length;\n  }\n\n  addMessage(message) {\n    this.$chatBody.insertAdjacentHTML('beforeend', _template__WEBPACK_IMPORTED_MODULE_0__[\"default\"].message(message));\n  }\n\n  updateRoom(room) {\n    this.$roomName.textContent = room.users.map((user) => user.nickname).join(', ');\n    this.$userNumber.textContent = room.users.length;\n    this.currentRoom = room;\n  }\n\n  inviteUsers(users) {\n    users.forEach((user) => {\n      this.currentRoom.addUser(user._id);\n    });\n  }\n}\n\n\n//# sourceURL=webpack:///./src/chat.js?");

/***/ }),

/***/ "./src/controller.js":
/*!***************************!*\
  !*** ./src/controller.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Controller; });\nclass Controller {\n  /**\n   * @param {!Model} model A model instance\n   * @param {!View} view A View instance\n   */\n  constructor(model, view) {\n    this.model = model;\n    this.view = view;\n\n    view.bindCreateCurrentUser(this.createCurrentUser.bind(this));\n    view.bindGetCurrentUser(this.getCurrentUser.bind(this));\n    view.bindClearCurrentUser(this.clearCurrentUser.bind(this));\n    view.bindUpdateFriendrequest(this.updateFriendrequest.bind(this));\n    view.bindSearchUsers(this.searchUsers.bind(this));\n    view.bindRequestFriend(this.requestFriend.bind(this));\n  }\n\n  /**\n   * @param {!string} email\n   * @param {!string} password\n   * @param {!string} nickname\n   */\n  createCurrentUser(email, password, nickname) {\n    this.model.insertCurrentUser({\n      email,\n      password,\n      nickname,\n    }, (error, currentUser) => {\n      if (error) return;\n\n      this.view.closeModal();\n      this.setCurrentUser(currentUser);\n    });\n  }\n\n  /**\n   * @param {!string} email\n   * @param {!string} password\n   */\n  getCurrentUser(email, password) {\n    this.model.findCurrentUser({\n      email,\n      password,\n    }, (error, currentUser) => {\n      if (error) return;\n\n      this.view.closeModal();\n      this.setCurrentUser(currentUser);\n    });\n  }\n\n  /**\n   * @param {CurrentUser} currentUser\n   */\n  setCurrentUser(currentUser) {\n    const { friendrequests, friends, rooms } = currentUser;\n\n    // model setting\n    this.model.setCurrentUser(currentUser);\n    this.model.onFriendPresenceChanged((friend) => {\n      alert(`${friend.nickname} is ${friend.isPresent ? 'logined!' : 'logout:('}`);\n    });\n    this.model.onFriendRequested((friendrequest) => {\n      this.view.addFriendrequests([friendrequest]);\n    });\n    this.model.onFriendAdded((friend) => {\n      this.view.addFriends([friend]);\n    });\n\n    // view rendering\n    this.view.renderCurrentUserInfo(currentUser);\n    this.view.addFriendrequests(friendrequests);\n    this.view.addFriends(friends);\n    this.view.renderRooms(rooms);\n  }\n\n  /**\n   * clear current user\n   */\n  clearCurrentUser() {\n    this.model.clearCurrentUser((error) => {\n      if (error) {\n        console.log(error);\n        return;\n      }\n\n      this.view.clear();\n    });\n  }\n\n  /**\n   * @param {string} id friendrequest's id\n   * @param {string} answer 'accept' | 'decline'\n   */\n  updateFriendrequest(id, answer) {\n    this.model.updateFriendrequest({\n      id,\n      answer,\n    }, () => {\n      this.view.removeFriendrequest(id);\n    });\n  }\n\n  /**\n   * @param {RegExp} value\n   */\n  searchUsers(value) {\n    this.model.findUsers({\n      fields: ['email', 'nickname'],\n      value,\n    }, (users) => {\n      this.view.renderSearchResults(users);\n    });\n  }\n\n  /**\n   * @param {string} userId\n   */\n  requestFriend(userId) {\n    this.model.insertFriendrequest({\n      to: userId,\n    }, () => {\n      console.log('request completed!');\n    });\n  }\n}\n\n\n//# sourceURL=webpack:///./src/controller.js?");

/***/ }),

/***/ "./src/friendList.js":
/*!***************************!*\
  !*** ./src/friendList.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return FriendList; });\n/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template */ \"./src/template.js\");\n\n\nclass FriendList {\n  constructor({ friendlist }) {\n    this.$friendList = friendlist;\n    this.$selectedFriend = null;\n    this.selectedFriendId = '';\n    this.unselectWithThisBind = this.unselect.bind(this);\n    this.friends = [];\n    this._registerAllEventListeners();\n  }\n\n  _registerAllEventListeners() {\n    this.$friendList.addEventListener('click', (e) => {\n      e.stopPropagation();\n\n      if (e.target.className !== 'friend__picture') return;\n\n      const $friend = e.target.closest('.friend');\n      this.select($friend);\n    });\n  }\n\n  onFriendRemoved(callback) {\n    this.$friendList.addEventListener('click', (e) => {\n      e.stopPropagation();\n\n      if (e.target.tagName !== 'BUTTON') return;\n      if (e.target.dataset.behavior !== 'remove') return;\n      if (!confirm('정말 친구 관계를 끊으시겠습니까?')) return this.unselectAndRemoveListener();\n\n      callback(this.selectedFriendId);\n      this.unselectAndRemoveListener();\n    });\n  }\n\n  // refactoring - duplication code above\n  onRoomCreated(callback) {\n    this.$friendList.addEventListener('click', (e) => {\n      e.stopPropagation();\n\n      if (e.target.tagName !== 'BUTTON') return;\n      if (e.target.dataset.behavior !== 'message') return;\n\n      callback(this.selectedFriendId);\n      this.unselectAndRemoveListener();\n    });\n  }\n\n  add(friend) {\n    this.friends.push(friend);\n    this.$friendList.insertAdjacentHTML('beforeend', _template__WEBPACK_IMPORTED_MODULE_0__[\"default\"].friend(friend));\n  }\n\n  select($friend) {\n    if (this.$selectedFriend === null) return this.selectFirst($friend);\n    if (this.$selectedFriend === $friend) return this.unselectAndRemoveListener();\n\n    this.unselect();\n    $friend.classList.add('friend--selected');\n    this.$selectedFriend = $friend;\n    this.selectedFriendId = $friend.dataset.id;\n  }\n\n  selectFirst($friend) {\n    $friend.classList.add('friend--selected');\n    this.$selectedFriend = $friend;\n    this.selectedFriendId = $friend.dataset.id;\n    window.addEventListener('click', this.unselectWithThisBind, { once: true });\n  }\n\n  unselectAndRemoveListener() {\n    this.unselect();\n    window.removeEventListener('click', this.unselectWithThisBind, { once: true });\n  }\n\n  unselect() {\n    this.$selectedFriend.classList.remove('friend--selected');\n    this.$selectedFriend = null;\n    this.selectedFriendId = '';\n  }\n\n  remove(friend) {\n    const $friend = this.$friendList.querySelector(`.friend[data-id=\"${friend._id}\"]`);\n\n    this.friends = this.friends.filter((eachFriend) => eachFriend._id !== friend._id);\n    this.$friendList.removeChild($friend);\n  }\n\n  getAllFriends() {\n    return this.friends.slice();\n  }\n}\n\n\n//# sourceURL=webpack:///./src/friendList.js?");

/***/ }),

/***/ "./src/helper.js":
/*!***********************!*\
  !*** ./src/helper.js ***!
  \***********************/
/*! exports provided: formatDateToDate, formatDateToTime */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"formatDateToDate\", function() { return formatDateToDate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"formatDateToTime\", function() { return formatDateToTime; });\nconst formatDateToDate = (dateObject) => {\n  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');\n  const date = dateObject.getDate().toString().padStart(2, '0');\n\n  return `${month}/${date}`;\n};\n\nconst formatDateToTime = (dateObject) => {\n  const hours = (dateObject.getHours() + 1).toString().padStart(2, '0');\n  const minutes = dateObject.getMinutes().toString().padStart(2, '0');\n\n  return `${hours}:${minutes}`;\n};\n\n\n\n\n//# sourceURL=webpack:///./src/helper.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template */ \"./src/template.js\");\n/* harmony import */ var _friendList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./friendList */ \"./src/friendList.js\");\n/* harmony import */ var _roomList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./roomList */ \"./src/roomList.js\");\n/* harmony import */ var _chat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chat */ \"./src/chat.js\");\n/* harmony import */ var _selectedUserList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./selectedUserList */ \"./src/selectedUserList.js\");\n/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./model */ \"./src/model.js\");\n/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./view */ \"./src/view.js\");\n/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./controller */ \"./src/controller.js\");\n\n\n\n\n\n\n\n\n\nlet currentUser = null;\n\nconst messenger = new Messenger({\n  apiKey: '2b8ed76c93763b0',\n});\n\nmessenger.initializeApp().catch((error) => console.error.bind(console, error));\n\nconst model = new _model__WEBPACK_IMPORTED_MODULE_5__[\"default\"](messenger);\nconst view = new _view__WEBPACK_IMPORTED_MODULE_6__[\"default\"](_template__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\nconst controller = new _controller__WEBPACK_IMPORTED_MODULE_7__[\"default\"](model, view);\n\nconst friendList = new _friendList__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({\n  friendlist: document.querySelector('.friend-list'),\n});\n\nfriendList.onFriendRemoved((friendId) => {\n  currentUser.removeFriend(friendId).catch((error) => console.error(console, error));\n});\nfriendList.onRoomCreated((friendId) => {\n  currentUser.createRoom({\n    inviteUserIds: [friendId],\n  })\n    .catch((error) => console.error(console, error));\n});\n\nconst roomList = new _roomList__WEBPACK_IMPORTED_MODULE_2__[\"default\"]({\n  roomList: document.querySelector('.room-list'),\n});\n\nconst chat = new _chat__WEBPACK_IMPORTED_MODULE_3__[\"default\"]({\n  chat: document.querySelector('.chat'),\n});\n\nroomList.onRoomSelected(chat.load.bind(chat));\n\nconst selectedUserList = new _selectedUserList__WEBPACK_IMPORTED_MODULE_4__[\"default\"]({\n  selectedUserList: document.querySelector('.selected-user-list'),\n});\n\nselectedUserList.onLoadUsers(friendList.getAllFriends.bind(friendList));\nselectedUserList.onConfirmButtonClicked(chat.inviteUsers.bind(chat));\nchat.onInviteButtonClick(selectedUserList.open.bind(selectedUserList));\n\nmessenger.onUserStateChanged((user) => {\n  currentUser = user;\n  // if (!user) return location.replace('http://localhost:3001');\n\n  //   toggle: document.querySelector('.friendrequest-toggle'),\n  //   badge: document.querySelector('.friendrequest-badge'),\n  // });\n\n  // currentUser = user;\n  // currentUser.onFriendAdded(friendList.add.bind(friendList));\n  // currentUser.onFriendRemoved(friendList.remove.bind(friendList));\n  // currentUser.onRoomAdded(roomList.add.bind(roomList));\n  // chat.onMessageSubmitted(currentUser.sendMessage.bind(currentUser));\n  // chat.onRoomOpened(currentUser.openRoom.bind(currentUser));\n  // chat.onRoomClosed(currentUser.closeRoom.bind(currentUser));\n  // chat.onLeaveRoomButtonClicked(currentUser.leaveRoom.bind(currentUser));\n  // currentUser.onMessage((message) => {\n  //   alert(`(currentUser.onMessage)${message.sender.nickname} : ${message.type === 'text' ? message.text : message.type}`);\n  // });\n  // currentUser.onRoomRemoved(roomList.remove.bind(roomList));\n  // currentUser.onRoomUpdated(roomList.update.bind(roomList));\n});\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/model.js":
/*!**********************!*\
  !*** ./src/model.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Model; });\nclass Model {\n  /**\n   * @param {Messenger} messenger messenger sdk\n   */\n  constructor(messenger) {\n    this.messenger = messenger;\n    this.currentUser = null;\n  }\n\n  /**\n   * @param {Function(User)} handler Called when friend signed in\n   */\n  onFriendPresenceChanged(handler) {\n    this.currentUser.onFriendPresenceChanged(handler);\n  }\n\n  /**\n   * @param {Function(Friendrequest)} handler Called when current user is requested friend\n   */\n  onFriendRequested(handler) {\n    this.currentUser.onFriendRequested(handler);\n  }\n\n  /**\n   * @param {Function} handler Called when friend added\n   */\n  onFriendAdded(handler) {\n    this.currentUser.onFriendAdded(handler);\n  }\n\n  /**\n   * @param {CurrentUser} currentUser currentUser to insert\n   * @param {function(Error, CurrentUser)} callback Called when currentUser is inserted or not\n   */\n  insertCurrentUser({ email, password, nickname }, callback) {\n    this.messenger.createUser(email, password, nickname)\n      .then((currentUser) => {\n        callback(null, currentUser);\n      })\n      .catch((error) => {\n        callback(error);\n      });\n  }\n\n  /**\n   *\n   * @param {CurrentUser} currentUser currentUser to find\n   * @param {function(Error, CurrentUser)} callback Called when currentUser is found or not\n   */\n  findCurrentUser({ email, password }, callback) {\n    this.messenger.signIn(email, password)\n      .then((currentUser) => {\n        callback(null, currentUser);\n      })\n      .catch((error) => {\n        callback(error);\n      });\n  }\n\n  /**\n   *\n   * @param {CurrentUser} currentUser currentUser to set\n   */\n  setCurrentUser(currentUser) {\n    this.currentUser = currentUser;\n  }\n\n  /**\n   * @param {Friendrequest} friendrequest\n   * @param {string} friendrequest.id friendrequest id\n   * @param {string} friendrequest.answer 'accept' | 'decline'\n   * @param {Function()} callback Called update is completed\n   */\n  updateFriendrequest({ id, answer }, callback) {\n    this.currentUser.responseFriendrequest(id, answer)\n      .then(() => {\n        callback();\n      });\n  }\n\n  /**\n   * @param {Object} query\n   * @param {Array} query.fields 'email' | 'nickname' or both\n   * @param {RegExp} query.value\n   * @param {Function(Array)} callback Called with users when all users are found\n   */\n  findUsers({ fields, value }, callback) {\n    const promises = fields.map((field) => this.messenger.getUsers(field, value));\n    Promise.all(promises)\n      .then((users) => {\n        const flattedUsers = users.flat();\n        const usersWithoutDuplication = flattedUsers.filter((user, index) => (flattedUsers.findIndex((e) => e.email === user.email) >= index));\n        callback(usersWithoutDuplication);\n      });\n  }\n\n  /**\n   * @param {Object} friendrequest\n   * @param {string} friendrequest.to The user id Who current user want to request friend to\n   * @param {Function()} callback Called when friendrequest is inserted seccessfully\n   */\n  insertFriendrequest({ to }, callback) {\n    this.currentUser.requestFriend(to)\n      .then(() => {\n        callback();\n      });\n  }\n\n  /**\n   * @param {Function} callback Function called when clearing currentUser\n   */\n  clearCurrentUser(callback) {\n    this.messenger.signOut()\n      .then(() => {\n        callback();\n      });\n  }\n}\n\n\n//# sourceURL=webpack:///./src/model.js?");

/***/ }),

/***/ "./src/roomList.js":
/*!*************************!*\
  !*** ./src/roomList.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return RoomList; });\n/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template */ \"./src/template.js\");\n\n\nclass RoomList {\n  constructor({ roomList }) {\n    this.$roomList = roomList;\n    this.rooms = {};\n  }\n\n  onRoomSelected(callback) {\n    this.$roomList.addEventListener('click', ({ target }) => {\n      const $room = target.closest('.room');\n\n      if (!$room) return;\n\n      const room = this.rooms[$room.dataset.id];\n\n      callback(room);\n    });\n  }\n\n  add(room) {\n    this.$roomList.insertAdjacentHTML('beforeend', _template__WEBPACK_IMPORTED_MODULE_0__[\"default\"].room(room));\n    this.rooms[room._id] = room;\n  }\n\n  remove(room) {\n    const roomId = room._id;\n    const $room = this.$roomList.querySelector(`.room[data-id=\"${roomId}\"]`);\n\n    this.$roomList.removeChild($room);\n    delete this.rooms[roomId];\n  }\n\n  update(room) {\n    const roomId = room._id;\n    const $room = this.$roomList.querySelector(`.room[data-id=\"${roomId}\"]`);\n    const $roomName = $room.querySelector('.room__name');\n    const $lastMessage = $room.querySelector('.room__last-message');\n\n    $roomName.textContent = room.users.map((user) => user.nickname).join(', ');\n    $lastMessage.textContent = room.lastMessage.text;\n    this.rooms[roomId] = room;\n  }\n}\n\n\n//# sourceURL=webpack:///./src/roomList.js?");

/***/ }),

/***/ "./src/selectedUserList.js":
/*!*********************************!*\
  !*** ./src/selectedUserList.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SelectedUserList; });\n/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template */ \"./src/template.js\");\n\n\nclass SelectedUserList {\n  constructor({ selectedUserList }) {\n    this.$selectedUserList = selectedUserList;\n    this.$selectedUserWrap = this.$selectedUserList.querySelector('.selected-user-wrap');\n    this.$confirmButton = this.$selectedUserList.querySelector('.button--confirm');\n    this.users = null;\n    this.selectedUsers = [];\n    this.loadUsers = null;\n    this._registerAllEventListeners();\n  }\n\n  _registerAllEventListeners() {\n    this.$selectedUserList.addEventListener('click', ({ target }) => {\n      if (target.tagName !== 'INPUT') return;\n\n      const $selectedUser = target.closest('.selected-user');\n      const userId = $selectedUser.dataset.id;\n\n      target.checked ? this.selectUser(userId) : this.unselectUser(userId);\n    });\n  }\n\n  onLoadUsers(callback) {\n    this.loadUsers = callback;\n  }\n\n  onConfirmButtonClicked(callback) {\n    this.$confirmButton.addEventListener('click', () => {\n      callback(this.selectedUsers);\n      this.close();\n    });\n  }\n\n  open() {\n    this.users = this.loadUsers();\n    this.$selectedUserList.classList.add('selected-user-list--active');\n    this.$selectedUserWrap.innerHTML = this.users.reduce((html, user) => html + _template__WEBPACK_IMPORTED_MODULE_0__[\"default\"].selectedUser(user), '');\n  }\n\n  selectUser(userId) {\n    const targetUser = this.users.find((user) => user._id === userId);\n    this.selectedUsers = this.selectedUsers.concat(targetUser);\n  }\n\n  unselectUser(userId) {\n    this.selectedUsers = this.selectedUsers.filter((user) => user._id !== userId);\n  }\n\n  close() {\n    this.users = null;\n    this.selectedUsers = [];\n    this.$selectedUserList.classList.remove('selected-user-list--active');\n  }\n}\n\n\n//# sourceURL=webpack:///./src/selectedUserList.js?");

/***/ }),

/***/ "./src/template.js":
/*!*************************!*\
  !*** ./src/template.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ \"./src/helper.js\");\n\n/**\n *\n * @param {CurrentUser} currentUser\n */\nconst currentUserInfo = ({ nickname }) => `\n  <div class=\"delimeter\">|</div>\n  <div class=\"current-user\">\n    <div class=\"current-user__picture\"></div>\n    <div class=\"current-user__nickname\">${nickname}</div>\n  </div>\n  <div class=\"delimeter\">|</div>\n  `;\n\nconst resultItem = ({ _id, email, nickname }) => `\n  <div class=\"search__user-item\" data-id=\"${_id}\">\n    <div class=\"search__user-name\">${nickname}</div>\n    <div class=\"search__user-email\">${email}</div>\n    <div class=\"search__user-relationship\">\n      <button class=\"button button--friendrequest\">Add</button>\n    </div>\n  </div>`;\n\nconst resultNoItem = () => '<div class=\"search__no-item\">no result</div>';\n\nconst friendrequest = ({ _id, from: sender }) => `\n  <div class=\"friendrequest\" data-id=\"${_id}\">\n    <div class=\"friendrequest__nickname\">${sender.nickname}</div>\n    <div class=\"friendrequest__buttons\">\n      <button class=\"button button--accept-friend\" data-answer=\"accept\">Accept</button>\n      <button class=\"button button--decline-friend\" data-answer=\"decline\">Decline</button>\n    </div>\n  </div>`;\n\nconst friend = ({ _id, nickname }) => `\n    <div class=\"friend\" data-id=\"${_id}\">\n      <div class=\"friend-content\">\n        <div class=\"friend__picture\"></div>\n        <div class=\"friend__popover\">\n          <div class=\"friend__popover-triangle\"></div>\n          <div class=\"friend__popover-content\">\n            <div class=\"friend__nickname\">${nickname}</div>\n            <div class=\"friend__buttons\">\n              <button class=\"button button--message\" data-behavior=\"message\">Message</button>\n              <button class=\"button button--remove-friend\" data-behavior=\"remove\">Remove</button>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>`;\n\nconst room = ({\n  _id, users, lastMessage, createdAt,\n}) => `\n  <div class=\"room\" data-id=\"${_id}\">\n    <div class=\"room__picture\"></div>\n    <div class=\"room__info\"><div class=\"room__info-center\">\n        <div class=\"room__name\">${users.map((user) => user.nickname).join(', ')}</div>\n        <div class=\"room__last-message\">${lastMessage ? lastMessage.text : 'new room'}</div>\n      </div>\n      <div class=\"room__last-message-date\">${lastMessage ? Object(_helper__WEBPACK_IMPORTED_MODULE_0__[\"formatDateToDate\"])(new Date(lastMessage.createdAt)) : Object(_helper__WEBPACK_IMPORTED_MODULE_0__[\"formatDateToDate\"])(new Date(createdAt))}</div>\n    </div>\n  </div>`;\n\nconst message = ({\n  type, sender, createdAt, text,\n}) => (type === 'text' ? `\n  <div class=\"chat__message\">\n    <div class=\"chat__message-picture\"></div>\n    <div class=\"chat__message-content\">\n      <div class=\"chat__message-header\">\n        <div class=\"chat__message-sender\">${sender.nickname}</div>\n        <div class=\"chat__message-created-at\">${Object(_helper__WEBPACK_IMPORTED_MODULE_0__[\"formatDateToTime\"])(new Date(createdAt))}</div>\n      </div>\n      <div class=\"chat__message-body\">${text}</div>\n    </div>\n  </div>` : `\n  <div class=\"chat__status-log\">${text}</div>`);\n\nconst selectedUser = ({ _id, nickname }) => `\n  <div class=\"selected-user\" data-id=\"${_id}\">\n    <input class=\"selected-user__checkbox\" type=\"checkbox\"></input>\n    <label class=\"selected-user__nickname\">${nickname}</label>\n  </div>\n  `;\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  currentUserInfo, resultItem, resultNoItem, friendrequest, friend, room, message, selectedUser,\n});\n\n\n//# sourceURL=webpack:///./src/template.js?");

/***/ }),

/***/ "./src/view.js":
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return View; });\n/* harmony import */ var _viewModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./viewModal */ \"./src/viewModal.js\");\n/* harmony import */ var _viewFriendrequestToggle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./viewFriendrequestToggle */ \"./src/viewFriendrequestToggle.js\");\n\n\n\nclass View {\n  /**\n   * @param {Object} template template object containing functions\n   */\n  constructor(template) {\n    this.template = template;\n    this.$signUpForm = document.querySelector('.form--sign-up');\n    this.$signInForm = document.querySelector('.form--sign-in');\n    this.$currentUserInfo = document.querySelector('.current-user-info');\n    this.$signInButton = document.querySelector('.sign-in');\n    this.$signOutButton = document.querySelector('.sign-out');\n    this.$friendrequestList = document.querySelector('.friendrequest-list');\n    this.$searchInput = document.querySelector('input');\n    this.$searchResult = document.querySelector('.search__result');\n    this.$friendList = document.querySelector('.friend-list');\n    this.modal = new _viewModal__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n      modal: document.querySelector('.modal'),\n      toggle: this.$signInButton,\n    });\n    this.friendrequestsToggle = new _viewFriendrequestToggle__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({\n      toggle: document.querySelector('.friendrequest-toggle'),\n      badge: document.querySelector('.friendrequest-badge'),\n    });\n\n    this.modal.bindClose(this.closeModal.bind(this));\n    this.friendrequestsToggle.bindToggle(this.toggleFriendrequestList.bind(this));\n  }\n\n  /**\n   * @param {Function} handler Function called on submit event.\n   */\n  bindCreateCurrentUser(handler) {\n    this.$signUpForm.addEventListener('submit', (e) => {\n      e.preventDefault();\n\n      const $form = e.target;\n      const $inputs = $form.querySelectorAll('input');\n      const inputValues = Array.from($inputs, ($input) => $input.value);\n\n      handler(...inputValues);\n    });\n  }\n\n  /**\n   * @param {Function} handler Function called on submit event\n   */\n  bindGetCurrentUser(handler) {\n    this.$signInForm.addEventListener('submit', (e) => {\n      e.preventDefault();\n\n      const $form = e.target;\n      const $inputs = $form.querySelectorAll('input');\n      const inputValues = Array.from($inputs, ($input) => $input.value);\n\n      handler(...inputValues);\n    });\n  }\n\n  /**\n   *\n   * @param {Function()} handler Function called on sign out click event\n   */\n  bindClearCurrentUser(handler) {\n    this.$signOutButton.addEventListener('click', () => {\n      handler();\n    });\n  }\n\n  /**\n   * @param {Function(string, string)} handler Called when response button clicked in friendrequest\n   */\n  bindUpdateFriendrequest(handler) {\n    this.$friendrequestList.addEventListener('click', ({ target }) => {\n      if (target.tagName !== 'BUTTON') return;\n\n      const { answer } = target.dataset;\n      const $friendrequest = target.closest('.friendrequest');\n      const { id } = $friendrequest.dataset;\n\n      handler(id, answer);\n    });\n  }\n\n  /**\n   * @param {Function(RegExp)} handler Called when input value is changed\n   */\n  bindSearchUsers(handler) {\n    this.$searchInput.addEventListener('input', async ({ target: { value } }) => {\n      if (value === '') {\n        this.$searchResult.classList.remove('search__result--active');\n        return;\n      }\n      const regexp = new RegExp(`^${value}`);\n\n      this.$searchResult.classList.add('search__result--active');\n      this.$searchResult.classList.add('search__result--loading');\n      handler(regexp);\n    });\n  }\n\n  /**\n   * @param {Function} handler Called when add button clicked in search result\n   */\n  bindRequestFriend(handler) {\n    this.$searchResult.addEventListener('click', ({ target }) => {\n      if (target.tagName !== 'BUTTON') return;\n\n      const $userItem = target.closest('.search__user-item');\n      const userId = $userItem.dataset.id;\n\n      handler(userId);\n    });\n  }\n\n  /**\n   * @param {CurrentUser} currentUser\n   */\n  renderCurrentUserInfo(currentUser) {\n    this.$currentUserInfo.innerHTML = this.template.currentUserInfo(currentUser);\n    this.$signInButton.classList.remove('sign-in--active');\n    this.$signOutButton.classList.add('sign-out--active');\n    this.friendrequestsToggle.active();\n  }\n\n  /**\n   * @param {Array} friendrequests array of friendrequest\n   */\n  addFriendrequests(friendrequests) {\n    friendrequests.forEach((friendrequest) => {\n      this.$friendrequestList.insertAdjacentHTML('beforeend', this.template.friendrequest(friendrequest));\n    });\n    this.friendrequestsToggle.setBadgeNumber(this.$friendrequestList.children.length);\n  }\n\n  /**\n   * @param {string} id friendrequest id\n   */\n  removeFriendrequest(id) {\n    const $friendrequest = this.$friendrequestList.querySelector(`[data-id=\"${id}\"]`);\n    this.$friendrequestList.removeChild($friendrequest);\n    this.friendrequestsToggle.setBadgeNumber(this.$friendrequestList.children.length);\n  }\n\n  /**\n   * @param {Array} users array of user\n   */\n  renderSearchResults(users) {\n    this.$searchResult.innerHTML = '';\n    this.$searchResult.innerHTML = users.length === 0 ? this.template.resultNoItem() : users.reduce((results, user) => results + this.template.resultItem(user), '');\n    this.$searchResult.classList.remove('search__result--loading');\n  }\n\n  /**\n   *\n   * @param {Array} friends array of friend\n   */\n  addFriends(friends) {\n    friends.forEach((friend) => {\n      this.$friendList.insertAdjacentHTML('beforeend', this.template.friend(friend));\n    });\n  }\n\n  /**\n   *\n   * @param {Array} rooms array of room\n   */\n  renderRooms(rooms) {\n    console.log(rooms);\n  }\n\n  /**\n   * close modal and reset form data\n   */\n  closeModal() {\n    this.modal.close();\n    this.$signInForm.reset();\n    this.$signUpForm.reset();\n  }\n\n  /**\n   * open or close friendrequest list\n   */\n  toggleFriendrequestList() {\n    this.$friendrequestList.classList.toggle('friendrequest-list--active');\n  }\n\n  /**\n   * clear all rendered contents and return to initial state (triggered when current user singed out)\n   */\n  clear() {\n    this.$currentUserInfo.innerHTML = '';\n    this.$signInButton.classList.add('sign-in--active');\n    this.$signOutButton.classList.remove('sign-out--active');\n    this.friendrequestsToggle.deactive();\n    this.$friendrequestList.innerHTML = '';\n    this.$friendrequestList.classList.remove('friendrequest-list--active');\n    this.$friendList.innerHTML = '';\n  }\n}\n\n\n//# sourceURL=webpack:///./src/view.js?");

/***/ }),

/***/ "./src/viewFriendrequestToggle.js":
/*!****************************************!*\
  !*** ./src/viewFriendrequestToggle.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ViewFriendrequestToggle; });\nclass ViewFriendrequestToggle {\n  /**\n   * @param {Object} elements\n   * @param {Element} elements.toggle element to open and close friendrequest list\n   * @param {Element} elements.badge counts the number of friendrequest\n   */\n  constructor({ toggle, badge }) {\n    this.$toggle = toggle;\n    this.$badge = badge;\n  }\n\n  /**\n   * @param {Function} handler called on click event in toggle element\n   */\n  bindToggle(handler) {\n    this.$toggle.addEventListener('click', () => {\n      handler();\n    });\n  }\n\n  /**\n   * make toggle visible when current user sign in\n   */\n  active() {\n    this.$toggle.classList.add('friendrequest-toggle--active');\n  }\n\n  /**\n   * make toggle invisible when current user sign out\n   */\n  deactive() {\n    this.$toggle.classList.remove('friendrequest-toggle--active');\n  }\n\n  /**\n   * @param {Number} number The number of friendrequests that badge displays\n   */\n  setBadgeNumber(number) {\n    if (number === 0) {\n      this.$badge.classList.remove('friendrequest-badge--active');\n    } else {\n      this.$badge.classList.add('friendrequest-badge--active');\n      this.$badge.textContent = number;\n    }\n  }\n}\n\n\n//# sourceURL=webpack:///./src/viewFriendrequestToggle.js?");

/***/ }),

/***/ "./src/viewModal.js":
/*!**************************!*\
  !*** ./src/viewModal.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ViewModal; });\nclass ViewModal {\n  /**\n   * @param {Object} elements\n   * @param {Element} elements.modal modal element\n   * @param {Element} elements.toggle element to open modal\n   */\n  constructor({ modal, toggle }) {\n    this.$modal = modal;\n    this.$toggle = toggle;\n    this.$modalContentContainer = modal.querySelector('.modal__content-container');\n    this.$modalContentSliderNext = modal.querySelector('.modal__content-slider--next');\n    this.$modalContentSliderBack = modal.querySelector('.modal__content-slider--back');\n\n    this.$toggle.addEventListener('click', () => {\n      this.open();\n    });\n    this.$modalContentSliderNext.addEventListener('click', () => {\n      this.$modalContentContainer.classList.add('modal__content-container--next');\n    });\n    this.$modalContentSliderBack.addEventListener('click', () => {\n      this.$modalContentContainer.classList.remove('modal__content-container--next');\n    });\n  }\n\n  /**\n   * @param {Function} handler Called when clicking on modal background\n   */\n  bindClose(handler) {\n    this.$modal.addEventListener('click', ({ target }) => {\n      if (target.className !== this.$modal.className) return;\n\n      handler();\n    });\n  }\n\n  /**\n   * open Modal\n   */\n  open() {\n    this.$modal.classList.add('modal--active');\n  }\n\n  /**\n   * close Modal\n   */\n  close() {\n    this.$modalContentContainer.classList.remove('modal__content-container--next');\n    this.$modal.classList.remove('modal--active');\n  }\n}\n\n\n//# sourceURL=webpack:///./src/viewModal.js?");

/***/ })

/******/ });