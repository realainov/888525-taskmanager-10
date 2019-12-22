import Board from './components/board';
import Filter from './components/filter';
import LoadButton from './components/load-button';
import SiteMenu from './components/site-menu';
import Task from './components/task';
import TaskEdit from './components/task-edit';
import {generateFilters} from "./data/filter";
import {generateTasks} from "./data/task";
import {render} from "./utils";

const TASK_COUNT = 22;

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_ON_BUTTON = 8;

const renderTask = (task) => {
  const taskElement = new Task(task).createElement();
  const taskEditElement = new TaskEdit(task).createElement();

  const editButtonElement = taskElement.querySelector(`.card__btn--edit`);

  editButtonElement.addEventListener(`click`, () => {
    taskListElement.replaceChild(taskEditElement, taskElement);
  });

  const editFormElement = taskEditElement.querySelector(`form`);

  editFormElement.addEventListener(`submit`, () => {
    taskListElement.replaceChild(taskElement, taskEditElement);
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

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const tasks = generateTasks(TASK_COUNT);

tasks.slice(0, SHOWING_TASKS_COUNT_ON_START).forEach((item) => {
  renderTask(item);
});

const loadButtonElement = new LoadButton().createElement();

render(taskListElement, loadButtonElement, `afterend`);

const loadMoreButton = siteMainElement.querySelector(`.load-more`);

let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

loadMoreButton.addEventListener(`click`, () => {
  tasks.slice(showingTaskCount, showingTaskCount + SHOWING_TASKS_COUNT_ON_BUTTON)
    .forEach((item) => {
      renderTask(item);
    });

  showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON;

  if (showingTaskCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
