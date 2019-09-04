import template from './template.js';

export default class Search {
  constructor({search}) {
    this.$search = search;
    this.$searchForm = this.$search.querySelector('form');
    this.$input = this.$search.querySelector('input');
    this.$result = this.$search.querySelector('.search__result');
    this._registerAllEventListeners();
  }

  _registerAllEventListeners() {
    this.$searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    // something wrong. check
    this.$search.addEventListener('click', (e) => {
      const checkOutside = ({target}) => {
        if(this.$search.contains(target)) return;

        window.removeEventListener('click', checkOutside, true);
        this.close();
      }

      window.addEventListener('click', checkOutside, true);
    })
  }
  
  onValueRequested(callback) {
    this.$input.addEventListener('input', async ({target: {value}}) => {
      if(value === '') return this.close();

      this.execute();

      const regexp = new RegExp(`^${value}`);
      const results = await callback(regexp);

      this.render(results);
    });
  }

  onFriendRequested(callback) {
    this.$result.addEventListener('click', ({target}) => {
      if(target.tagName !== 'BUTTON') return;

      const $userItem = target.closest('.search__user-item');
      const userId = $userItem.dataset.id;
      
      callback(userId);
    });
  }

  render(results) {
    const templatedResults = results.length > 0 ? results.reduce((html, result) => html + template.resultItem(result), '') : '<div class="search__no-item">no result</div>';

    this.$search.classList.remove('search--loading');
    this.$search.classList.add('search--complete');
    this.$result.innerHTML = templatedResults;
  }

  initialze() {
    this.$result.innerHTML = '';
  }

  execute() {
    this.initialze();
    this.$search.classList.add('search--loading');
  }

  close() {
    this.initialze();
    this.$search.classList.remove('search--loading');
    this.$search.classList.remove('search--complete');
  }
}