import TaskComponent from '../components/task.js';
import TaskEditComponent from '../components/task-edit.js';
import {render, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToTaskEdit();

      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => this._onDataChange());

    this._taskComponent.setFavoritesButtonClickHandler(() => this._onDataChange());

    this._taskEditComponent.setEditFormSubmitHandler((evt) => {
      evt.preventDefault();

      this._replaceTaskEditToTask();
    });

    if (oldTaskEditComponent && oldTaskComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._taskComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceTaskEditToTask();
    }
  }

  _replaceTaskEditToTask() {
    this._taskEditComponent.reset();

    this._mode = Mode.DEFAULT;

    replace(this._taskComponent, this._taskEditComponent);
  }

  _replaceTaskToTaskEdit() {
    this._onViewChange();

    this._mode = Mode.EDIT;

    replace(this._taskEditComponent, this._taskComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceTaskEditToTask();

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
