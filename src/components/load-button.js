import AbstractComponent from './abstract-component';

const createTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class LoadButtonComponent extends AbstractComponent {
  getTemplate() {
    return createTemplate();
  }
}
