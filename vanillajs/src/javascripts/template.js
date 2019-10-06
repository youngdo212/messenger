import { formatDateToDate, formatDateToTime } from './helper';
/**
 *
 * @param {CurrentUser} currentUser
 */
const currentUser = ({ nickname }) => `${nickname}`;

const resultItem = ({ _id, email, nickname }) => `
  <div class="search__user-item" data-id="${_id}">
    <div class="search__user-name">${nickname}</div>
    <div class="search__user-email">${email}</div>
    <div class="search__user-relationship">
      <button class="button button--friendrequest">Add</button>
    </div>
  </div>`;

const resultNoItem = () => '<div class="search__no-item">no result</div>';

const friendrequest = ({ _id, from: sender }) => `
  <div class="friendrequest" data-id="${_id}">
    <div class="friendrequest__nickname">${sender.nickname}</div>
    <div class="friendrequest__button-list">
      <button class="friendrequest__button button" data-answer="accept">Accept</button>
      <button class="friendrequest__button button" data-answer="decline">Decline</button>
    </div>
  </div>`;

const friend = ({ _id, nickname, isPresent }) => `
    <div class="friend ${isPresent ? 'friend--signed-in' : ''}" data-id="${_id}" data-nickname="${nickname}">
      <div class="friend__content">
        <div class="friend__picture"></div>
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
  <div class="message message--theme-text">
    <div class="message__picture"></div>
    <div class="message__content">
      <div class="message__header">
        <div class="message__sender">${sender.nickname}</div>
        <div class="message__created-at">${formatDateToTime(new Date(createdAt))}</div>
      </div>
      <div class="message__body">${text}</div>
    </div>
  </div>` : `
  <div class="message message--theme-status">${text}</div>`);

const selectedUser = ({ _id, nickname }) => `
  <div class="selected-user" data-id="${_id}">
    <input class="selected-user__checkbox" type="checkbox"></input>
    <label class="selected-user__nickname">${nickname}</label>
  </div>
  `;

const userInUserSelect = ({ _id, nickname }) => `
  <div class="user-select__user" data-id="${_id}">
    <div class="user-select__user-avatar"></div>
    <span class="user-select__user-nickname">${nickname}</span>
  </div>
`;

const selectedUserInUserSelect = ({ id, nickname }) => `
  <div class="user-select__selected-user tag" data-id="${id}">
    <span class="tag__name">${nickname}</span>
    <button class="tag__remove-button"></button>
  </div>
`;

export default {
  currentUser,
  resultItem,
  resultNoItem,
  friendrequest,
  friend,
  room,
  message,
  selectedUser,
  userInUserSelect,
  selectedUserInUserSelect,
};
