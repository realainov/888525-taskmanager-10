import LoadButtonComponent from '../components/load-button';
import TasksComponent from '../components/tasks';
import SortComponent from '../components/sort';
import NoTasksComponent from '../components/no-tasks';
import TaskController, {EmptyTask} from './task';
import {render, remove} from '../utils/render';
import {SortType, Mode} from '../const';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTasks = (container, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(container, onDataChange, onViewChange);

    taskController.render(task);

    return taskController;
  });
};

export default class BoardController {
  constructor(containerComponent, tasksModel, api) {
    this._containerComponent = containerComponent;
    this._tasksModel = tasksModel;
    this._api = api;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadButtonComponent = new LoadButtonComponent();

    this._creatingTask = null;

    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._containerComponent.hide();
  }

  show() {
    this._containerComponent.show();
  }

  render() {
    const tasks = this._tasksModel.getTasks();

    const containerElement = this._containerComponent.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(containerElement, this._noTasksComponent);

      return;
    }

    render(containerElement, this._sortComponent);
    render(containerElement, this._tasksComponent);

    this._renderTasks(tasks.slice(0, this._showingTasksCount));

    this._renderLoadButton();
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    this._onViewChange();

    const taskListElement = this._tasksComponent.getElement();

    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);

    this._creatingTask.render(EmptyTask, Mode.ADDING);
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadButton();
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);

    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _renderLoadButton() {
    remove(this._loadButtonComponent);

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const containerElement = this._containerComponent.getElement();

    render(containerElement, this._loadButtonComponent);

    this._loadButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onDataChange(taskController, oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingTask = null;

      if (newData === null) {
        taskController.destroy();

        this._updateTasks(this._showingTasksCount);
      } else {
        this._tasksModel.addTask(newData);

        taskController.render(newData, Mode.DEFAULT);

        const destroyedTask = this._showedTaskControllers.pop();
        destroyedTask.destroy();

        this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
        this._showingTasksCount = this._showedTaskControllers.length;
      }
    } else if (newData === null) {
      this._tasksModel.removeTask(oldData.id);

      this._updateTasks(this._showingTasksCount);
    } else {
      this._api.updateTask(newData, oldData.id)
        .then((task) => {
          const isSuccess = this._tasksModel.updateTask(task, oldData.id);

          if (isSuccess) {
            taskController.render(task, Mode.DEFAULT);

            this._updateTasks(this._showingTasksCount);
          }
        });
    }
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((item) => item.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const tasks = this._tasksModel.getTasks();

    let sortedTasks = [];

    switch (sortType) {
      case SortType.DATE_UP:
        sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
        sortedTasks = tasks.slice(0, this._showingTasksCount);
        break;
    }

    this._removeTasks();
    this._renderTasks(sortedTasks);

    if (sortType === SortType.DEFAULT) {
      this._renderLoadButton();
    } else {
      remove(this._loadButtonComponent);
    }
  }

  _onFilterChange() {
    this._updateTasks(SHOWING_TASKS_COUNT_ON_START);
  }

  _onLoadMoreButtonClick() {
    const prevTasksCount = this._showingTasksCount;
    const tasks = this._tasksModel.getTasks();

    this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    this._renderTasks(tasks.slice(prevTasksCount, this._showingTasksCount));

    if (this._showingTasksCount >= tasks.length) {
      remove(this._loadButtonComponent);
    }
  }
}
