const formatDateToDate = (dateObject) => {
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const date = dateObject.getDate().toString().padStart(2, '0');

  return `${month}/${date}`;
};

const formatDateToTime = (dateObject) => {
  const hours = (dateObject.getHours() + 1).toString().padStart(2, '0');
  const minutes = dateObject.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};

const EventEmitter = class {
  constructor() {
    this.events = {};
  }

  /**
   * @param {string} eventName name of the event
   * @param {Function} listener handler of the event
   */
  on(eventName, listener) {
    const listeners = this.events[eventName] || [];

    this.events[eventName] = listeners.concat(listener);
  }

  /**
   * @param {string} eventName
   * @param {Function} listener
   */
  off(eventName, listener) {
    const listeners = this.events[eventName];

    if (!listeners) return;

    this.events[eventName] = listeners.filter((attachedListener) => attachedListener !== listener);
  }

  /**
   * @param {string} eventName
   * @param {Funtion} listener
   */
  once(eventName, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(eventName, wrapper);
    };

    this.on(eventName, wrapper);
  }

  /**
   * @param {string} eventName
   * @param  {...any} args
   */
  emit(eventName, ...args) {
    const listeners = this.events[eventName];

    if (!listeners) return;

    listeners.forEach((listener) => {
      listener(...args);
    });
  }
};

export { formatDateToDate, formatDateToTime, EventEmitter };
