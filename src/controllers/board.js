import TaskComponent from '../components/task';
import TaskEditComponent from '../components/task-edit';
import LoadButtonComponent from '../components/load-button';
import TasksComponent from '../components/tasks';
import NoTasksComponent from '../components/no-tasks';
import SortComponent from '../components/sort';
import {render, replace, remove} from '../utils/render';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_ON_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const onEscapeKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replace(taskComponent, taskEditComponent);

      document.removeEventListener(`keydown`, onEscapeKeyDown);
    }
  };

  taskComponent.editButton.addEventListener(`click`, () => {
    replace(taskEditComponent, taskComponent);

    document.addEventListener(`keydown`, onEscapeKeyDown);
  });

  taskEditComponent.editForm.addEventListener(`submit`, () => {
    replace(taskComponent, taskEditComponent);

    document.removeEventListener(`keydown`, onEscapeKeyDown);
  });

  render(taskListElement, taskComponent);
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
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(this._containerComponent.getTemplate(), this._noTasksComponent);
    } else {
      render(this._containerComponent.getElement(), this._sortComponent);
      render(this._containerComponent.getElement(), this._tasksComponent);

      const taskListElement = this._containerComponent.tasks;

      tasks.slice(0, SHOWING_TASKS_COUNT_ON_START).forEach((item) => {
        renderTask(taskListElement, item);
      });

      render(taskListElement, this._loadButtonComponent, `afterend`);

      let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

      this._loadButtonComponent.getElement().addEventListener(`click`, () => {
        tasks.slice(showingTaskCount, showingTaskCount + SHOWING_TASKS_COUNT_ON_BUTTON)
          .forEach((item) => {
            renderTask(taskListElement, item);
          });

        showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON;

        if (showingTaskCount >= tasks.length) {
          remove(this._loadButtonComponent);
        }
      });
    }
  }
}
