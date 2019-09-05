import { formatDateToDate, formatDateToTime } from './helper';

const userInfo = ({ nickname }) => `
  <div class="friendrequest-toggle">Friend requests
    <div class="friendrequest-badge"></div>
  </div>
  <div class="friendrequest-list"></div>
  <div class="delimeter">|</div>
  <div class="user">
    <div class="user__picture"></div>
    <div class="user__nickname">${nickname}</div>
  </div>
  <div class="delimeter">|</div>
  <div class="sign-out">Sign out</div>
  `;

const resultItem = ({ _id, email, nickname }) => `
  <div class="search__user-item" data-id="${_id}">
    <div class="search__user-name">${nickname}</div>
    <div class="search__user-email">${email}</div>
    <div class="search__user-relationship">
      <button class="button button--friendrequest">Add</button>
    </div>
  </div>`;

const friendrequest = ({ _id, from: sender }) => `
  <div class="friendrequest" data-id="${_id}">
    <div class="friendrequest__nickname">${sender.nickname}</div>
    <div class="friendrequest__buttons">
      <button class="button button--accept-friend" data-answer="accept">Accept</button>
      <button class="button button--decline-friend" data-answer="decline">Decline</button>
    </div>
  </div>`;

const friend = ({ _id, nickname }) => `
    <div class="friend" data-id="${_id}">
      <div class="friend-content">
        <div class="friend__picture"></div>
        <div class="friend__popover">
          <div class="friend__popover-triangle"></div>
          <div class="friend__popover-content">
            <div class="friend__nickname">${nickname}</div>
            <div class="friend__buttons">
              <button class="button button--message" data-behavior="message">Message</button>
              <button class="button button--remove-friend" data-behavior="remove">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;

const room = ({
  _id, users, lastMessage, createdAt,
}) => `
  <div class="room" data-id="${_id}">
    <div class="room__picture"></div>
    <div class="room__info"><div class="room__info-center">
        <div class="room__name">${users.map((user) => user.nickname).join(', ')}</div>
        <div class="room__last-message">${lastMessage ? lastMessage.text : 'new room'}</div>
      </div>
      <div class="room__last-message-date">${lastMessage ? formatDateToDate(new Date(lastMessage.createdAt)) : formatDateToDate(new Date(createdAt))}</div>
    </div>
  </div>`;

const message = ({
  type, sender, createdAt, text,
}) => (type === 'text' ? `
  <div class="chat__message">
    <div class="chat__message-picture"></div>
    <div class="chat__message-content">
      <div class="chat__message-header">
        <div class="chat__message-sender">${sender.nickname}</div>
        <div class="chat__message-created-at">${formatDateToTime(new Date(createdAt))}</div>
      </div>
      <div class="chat__message-body">${text}</div>
    </div>
  </div>` : `
  <div class="chat__status-log">${text}</div>`);

const selectedUser = ({ _id, nickname }) => `
  <div class="selected-user" data-id="${_id}">
    <input class="selected-user__checkbox" type="checkbox"></input>
    <label class="selected-user__nickname">${nickname}</label>
  </div>
  `;

export default {
  userInfo, resultItem, friendrequest, friend, room, message, selectedUser,
};
