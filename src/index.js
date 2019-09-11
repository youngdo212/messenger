import template from './template';
import RoomList from './roomList';
import Chat from './chat';
import SelectedUserList from './selectedUserList';
import Model from './model';
import View from './view';
import Controller from './controller';

let currentUser = null;

const messenger = new Messenger({
  apiKey: '2b8ed76c93763b0',
});

messenger.initializeApp().catch((error) => console.error.bind(console, error));

const model = new Model(messenger);
const view = new View(template);
const controller = new Controller(model, view);

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

selectedUserList.onConfirmButtonClicked(chat.inviteUsers.bind(chat));
chat.onInviteButtonClick(selectedUserList.open.bind(selectedUserList));

messenger.onUserStateChanged((user) => {
  currentUser = user;
  // if (!user) return location.replace('http://localhost:3001');

  //   toggle: document.querySelector('.friendrequest-toggle'),
  //   badge: document.querySelector('.friendrequest-badge'),
  // });

  // currentUser = user;
  // currentUser.onFriendAdded(friendList.add.bind(friendList));
  // currentUser.onFriendRemoved(friendList.remove.bind(friendList));
  // currentUser.onRoomAdded(roomList.add.bind(roomList));
  // chat.onMessageSubmitted(currentUser.sendMessage.bind(currentUser));
  // chat.onRoomOpened(currentUser.openRoom.bind(currentUser));
  // chat.onRoomClosed(currentUser.closeRoom.bind(currentUser));
  // chat.onLeaveRoomButtonClicked(currentUser.leaveRoom.bind(currentUser));
  // currentUser.onMessage((message) => {
  //   alert(`(currentUser.onMessage)${message.sender.nickname} : ${message.type === 'text' ? message.text : message.type}`);
  // });
  // currentUser.onRoomRemoved(roomList.remove.bind(roomList));
  // currentUser.onRoomUpdated(roomList.update.bind(roomList));
});
