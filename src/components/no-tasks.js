import {createElement} from '../utils.js';

const createTemplate = () => {
  return (
    `<p class="board__no-tasks">
      Click «ADD NEW TASK» in menu to create your first task
    </p>`
  );
};


export default class NoTasks {
  constructor() {
    this._element = null;
  }

  createElement() {
    if (!this._element) {
      this._element = createElement(createTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
