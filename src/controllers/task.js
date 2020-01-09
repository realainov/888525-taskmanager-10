import TaskComponent from '../components/task.js';
import TaskEditComponent from '../components/task-edit.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import {Color, Mode} from '../const';

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false
  },
  tags: [],
  color: Color.BLACK,
  isFavorite: false,
  isArchive: false
};

export default class TaskController {
  constructor(containerElement, onDataChange, onViewChange) {
    this._containerElement = containerElement;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task, mode = Mode.DEFAULT) {
    this._mode = mode;

    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToTaskEdit();

      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditComponent.setEditFormSubmitHandler((evt) => {
      evt.preventDefault();

      const data = this._taskEditComponent.getData();

      this._onDataChange(this, task, data);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    });

    this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, task, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);

          this._replaceTaskEditToTask();
        } else {
          render(this._containerElement, this._taskComponent);
        }

        break;
      case Mode.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }

        document.addEventListener(`keydown`, this._onEscKeyDown);

        render(this._containerElement, this._taskEditComponent, RenderPosition.AFTERBEGIN);

        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceTaskEditToTask();
    }
  }

  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceTaskEditToTask() {
    this._taskEditComponent.reset();

    this._mode = Mode.DEFAULT;

    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._taskComponent, this._taskEditComponent);
    }
  }

  _replaceTaskToTaskEdit() {
    this._onViewChange();

    this._mode = Mode.EDIT;

    replace(this._taskEditComponent, this._taskComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }

      this._replaceTaskEditToTask();

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
