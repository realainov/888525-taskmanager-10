import TaskComponent from '../components/task';
import TaskEditComponent from '../components/task-edit';
import LoadButtonComponent from '../components/load-button';
import TasksComponent from '../components/tasks';
import NoTasksComponent from '../components/no-tasks';
import SortComponent from '../components/sort';
import {SortType} from '../components/sort';
import {render, replace, remove, RenderPosition} from '../utils/render';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_ON_BUTTON = 8;

const renderTask = (container, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replace(taskComponent, taskEditComponent);

      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.setEditButtonClickHandler(() => {
    replace(taskEditComponent, taskComponent);

    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setEditFormSubmitHandler(() => {
    replace(taskComponent, taskEditComponent);

    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, taskComponent);
};

export default class BoardController {
  constructor(containerComponent) {
    this._containerComponent = containerComponent;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadButtonComponent = new LoadButtonComponent();
  }

  render(tasks) {
    const renderLoadButton = (container) => {
      let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

      if (showingTaskCount > tasks.length) {
        return;
      }

      render(container, this._loadButtonComponent, RenderPosition.AFTEREND);

      this._loadButtonComponent.setClickHandler(() => {
        tasks.slice(showingTaskCount, showingTaskCount + SHOWING_TASKS_COUNT_ON_BUTTON)
          .forEach((item) => {
            renderTask(container, item);
          });

        showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON;

        if (showingTaskCount >= tasks.length) {
          remove(this._loadButtonComponent);
        }
      });
    };

    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(this._containerComponent.getElement(), this._noTasksComponent);
    } else {
      render(this._containerComponent.getElement(), this._sortComponent);
      render(this._containerComponent.getElement(), this._tasksComponent);

      tasks.slice(0, SHOWING_TASKS_COUNT_ON_START).forEach((task) => {
        renderTask(this._tasksComponent.getElement(), task);
      });

      renderLoadButton(this._tasksComponent.getElement(), tasks);

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        let sortedTasks = [];

        switch (sortType) {
          case SortType.DATE_UP:
            sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
            break;
          case SortType.DATE_DOWN:
            sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
            break;
          case SortType.DEFAULT:
            sortedTasks = tasks.slice(0, SHOWING_TASKS_COUNT_ON_START);
            break;
        }

        this._tasksComponent.getElement().innerHTML = ``;

        sortedTasks.forEach((task) => {
          renderTask(this._tasksComponent.getElement(), task);
        });

        if (sortType === SortType.DEFAULT) {
          renderLoadButton();
        } else {
          remove(this._loadButtonComponent);
        }
      });
    }
  }
}
