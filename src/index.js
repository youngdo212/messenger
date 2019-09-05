import template from './template';
import Modal from './modal';
import Search from './search';
import FriendrequestList from './friendrequestList';
import FriendList from './friendList';
import RoomList from './roomList';
import Chat from './chat';
import SelectedUserList from './selectedUserList';

let currentUser = null;

const messenger = new Messenger({
  apiKey: '2b8ed76c93763b0',
});

const userInfo = document.querySelector('.user-info');

messenger.initializeApp().catch((error) => console.error.bind(console, error));

const modal = new Modal({
  modal: document.querySelector('.modal'),
  openButton: document.querySelector('.sign-in'),
});

modal.onUserCreated(messenger.createUser.bind(messenger));
modal.onUserSignedIn(messenger.signIn.bind(messenger));

const search = new Search({
  search: document.querySelector('.search'),
});

search.onValueRequested(messenger.searchUsers.bind(messenger));
search.onFriendRequested((userId) => {
  currentUser.requestFriend(userId).catch((error) => console.error(console, error));
});

let friendrequestList = null;
let signOutButton = null;

const friendList = new FriendList({
  friendlist: document.querySelector('.friend-list'),
});

friendList.onFriendRemoved((friendId) => {
  currentUser.removeFriend(friendId).catch((error) => console.error(console, error));
});
friendList.onRoomCreated((friendId) => {
  currentUser.createRoom({
    inviteUserIds: [friendId],
  })
    .catch((error) => console.error(console, error));
});

const roomList = new RoomList({
  roomList: document.querySelector('.room-list'),
});

const chat = new Chat({
  chat: document.querySelector('.chat'),
});

roomList.onRoomSelected(chat.load.bind(chat));

const selectedUserList = new SelectedUserList({
  selectedUserList: document.querySelector('.selected-user-list'),
});

selectedUserList.onLoadUsers(friendList.getAllFriends.bind(friendList));
selectedUserList.onConfirmButtonClicked(chat.inviteUsers.bind(chat));
chat.onInviteButtonClick(selectedUserList.open.bind(selectedUserList));

messenger.onUserStateChanged((user) => {
  if (!user) return location.replace('http://localhost:3001');

  userInfo.innerHTML = template.userInfo(user);

  friendrequestList = new FriendrequestList({
    friendrequestList: document.querySelector('.friendrequest-list'),
    toggle: document.querySelector('.friendrequest-toggle'),
    badge: document.querySelector('.friendrequest-badge'),
  });

  signOutButton = document.querySelector('.sign-out');
  signOutButton.addEventListener('click', () => {
    currentUser.disconnect().catch((error) => console.error(console, error));
  });

  currentUser = user;
  currentUser.connect().catch((error) => console.error(console, error));
  currentUser.onFriendRequested(friendrequestList.add.bind(friendrequestList));
  currentUser.onFriendAdded(friendList.add.bind(friendList));
  currentUser.onFriendRemoved(friendList.remove.bind(friendList));
  currentUser.onFriendPresenceChanged((friend) => {
    alert(`${friend.nickname} is ${friend.isPresent ? 'logined!' : 'logout:('}`);
  });
  currentUser.onRoomAdded(roomList.add.bind(roomList));
  chat.onMessageSubmitted(currentUser.sendMessage.bind(currentUser));
  chat.onRoomOpened(currentUser.openRoom.bind(currentUser));
  chat.onRoomClosed(currentUser.closeRoom.bind(currentUser));
  chat.onLeaveRoomButtonClicked(currentUser.leaveRoom.bind(currentUser));
  currentUser.onMessage((message) => {
    alert(`(currentUser.onMessage)${message.sender.nickname} : ${message.type === 'text' ? message.text : message.type}`);
  });
  currentUser.onRoomRemoved(roomList.remove.bind(roomList));
  currentUser.onRoomUpdated(roomList.update.bind(roomList));
});
