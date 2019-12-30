import AbstractComponent from './abstract-component';

const createTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class TasksComponent extends AbstractComponent {
  getTemplate() {
    return createTemplate();
  }
}
