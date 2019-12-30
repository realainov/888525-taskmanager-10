import AbstractComponent from './abstract-component';

const createTemplate = () => {
  return (
    `<section class="board container"></section>`
  );
};

export default class BoardComponent extends AbstractComponent {
  getTemplate() {
    return createTemplate();
  }

  get tasks() {
    return this.findElement(`.board__tasks`);
  }
}
