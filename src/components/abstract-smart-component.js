import AbstractComponent from './abstract-component.js';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryEventListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender(isWithListeners = true) {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    if (isWithListeners) {
      this.recoveryEventListeners();
    }
  }
}
