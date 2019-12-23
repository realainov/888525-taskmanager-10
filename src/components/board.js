import {createElement} from "../utils";

const createTemplate = () => {
  return (
    `<section class="board container"></section>`
  );
};

export default class Board {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(createTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
