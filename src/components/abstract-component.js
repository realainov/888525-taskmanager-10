const createElement = (template) => {
  const newElement = document.createElement(`div`);

  newElement.insertAdjacentHTML(`beforeend`, template);

  return newElement.firstChild;
};

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  findElement(selector) {
    return this.getElement().querySelector(selector);
  }

  removeElement() {
    this._element = null;
  }
}
