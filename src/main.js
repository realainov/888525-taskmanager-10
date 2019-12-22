import Board from './components/board';
import Sort from './components/sort';
import Filter from './components/filter';
import LoadButton from './components/load-button';
import SiteMenu from './components/site-menu';
import Tasks from './components/tasks';
import NoTasks from './components/no-tasks';
import Task from './components/task';
import TaskEdit from './components/task-edit';
import {generateFilters} from "./data/filter";
import {generateTasks} from "./data/task";
import {render} from "./utils";

const TASK_COUNT = 22;

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_ON_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const taskElement = new Task(task).createElement();
  const taskEditElement = new TaskEdit(task).createElement();

  const onEscapeKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      taskListElement.replaceChild(taskElement, taskEditElement);

      document.removeEventListener(`keydown`, onEscapeKeyDown);
    }
  };

  const editButtonElement = taskElement.querySelector(`.card__btn--edit`);

  editButtonElement.addEventListener(`click`, () => {
    taskListElement.replaceChild(taskEditElement, taskElement);

    document.addEventListener(`keydown`, onEscapeKeyDown);
  });

  const editFormElement = taskEditElement.querySelector(`form`);

  editFormElement.addEventListener(`submit`, () => {
    taskListElement.replaceChild(taskElement, taskEditElement);

    document.removeEventListener(`keydown`, onEscapeKeyDown);
  });

  render(taskListElement, taskElement);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuElement = new SiteMenu().createElement();

render(siteHeaderElement, siteMenuElement);

const filters = generateFilters();
const filterElement = new Filter(filters).createElement();
const boardElement = new Board().createElement();

render(siteMainElement, filterElement);
render(siteMainElement, boardElement);

const tasks = generateTasks(TASK_COUNT);
const isAllTasksArchived = tasks.every((task) => task.isArchive);

if (isAllTasksArchived) {
  const noTasksElement = new NoTasks().createElement();

  render(boardElement, noTasksElement);
} else {
  const sortElement = new Sort().createElement();
  const tasksElement = new Tasks().createElement();

  render(boardElement, sortElement);
  render(boardElement, tasksElement);

  const taskListElement = boardElement.querySelector(`.board__tasks`);

  tasks.slice(0, SHOWING_TASKS_COUNT_ON_START).forEach((item) => {
    renderTask(taskListElement, item);
  });

  const loadButtonElement = new LoadButton().createElement();

  render(taskListElement, loadButtonElement, `afterend`);

  const loadMoreButton = siteMainElement.querySelector(`.load-more`);

  let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

  loadMoreButton.addEventListener(`click`, () => {
    tasks.slice(showingTaskCount, showingTaskCount + SHOWING_TASKS_COUNT_ON_BUTTON)
      .forEach((item) => {
        renderTask(taskListElement, item);
      });

    showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON;

    if (showingTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
