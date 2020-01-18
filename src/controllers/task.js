import TaskModel from '../models/task.js';
import TaskComponent from '../components/task.js';
import TaskEditComponent from '../components/task-edit.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import {Color, Mode, DAYS} from '../const';

const SHAKE_ANIMATION_TIMEOUT = 600;

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

const parseFormData = (formData) => {
  const date = formData.get(`date`);
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});

  return new TaskModel({
    'description': formData.get(`text`),
    'due_date': date ? new Date(date) : null,
    'tags': formData.getAll(`hashtag`),
    'repeating_days': formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    'color': formData.get(`color`),
    'is_favorite': false,
    'is_done': false,
  });
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

      this._taskEditComponent.setData({
        saveButtonText: `Saving...`,
      });

      const formData = this._taskEditComponent.getData();
      const data = parseFormData(formData);

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

    this._taskEditComponent.setDeleteButtonClickHandler(() => {
      this._taskEditComponent.setData({
        deleteButtonText: `Deleting...`,
      });

      this._onDataChange(this, task, null);
    });

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

  shake() {
    this._taskEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._taskComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._taskEditComponent.getElement().style.animation = ``;
      this._taskComponent.getElement().style.animation = ``;

      this._taskEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
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
