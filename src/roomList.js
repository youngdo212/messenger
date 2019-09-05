import template from './template.js';

export default class RoomList {
  constructor({roomList}) {
    this.$roomList = roomList;
    this.rooms = {};
  }

  onRoomSelected(callback) {
    this.$roomList.addEventListener('click', ({target}) => {
      const $room = target.closest('.room');

      if(!$room) return;

      const room = this.rooms[$room.dataset.id];

      callback(room);
    });
  }

  add(room) {
    this.$roomList.insertAdjacentHTML('beforeend', template.room(room));
    this.rooms[room._id] = room;
  }

  remove(room) {
    const roomId = room._id;
    const $room = this.$roomList.querySelector(`.room[data-id="${roomId}"]`);

    this.$roomList.removeChild($room);
    delete this.rooms[roomId];
  }

  update(room) {
    const roomId = room._id;
    const $room = this.$roomList.querySelector(`.room[data-id="${roomId}"]`);
    const $roomName = $room.querySelector('.room__name');
    const $lastMessage = $room.querySelector('.room__last-message');

    $roomName.textContent = room.users.map(user => user.nickname).join(', ');
    $lastMessage.textContent = room.lastMessage.text;
    this.rooms[roomId] = room;
  }
}