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
  setCurrentUser(currentUser) {
    this.model.setCurrentUser(currentUser);
    this.view.renderCurrentUserInfo(currentUser);
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
}
