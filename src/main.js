import {board} from './components/board';
import {filter} from './components/filter';
import {loadMenuButton} from './components/load-menu-button';
import {siteMenu} from './components/site-menu';
import {task} from './components/task';
import {taskEdit} from './components/task-edit';
import {generateFilters} from "./data/filter";
import {generateTasks} from "./data/task";

const TASK_COUNT = 22;

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_ON_BUTTON = 8;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, siteMenu.createTemplate());

const filters = generateFilters();

render(siteMainElement, filter.createTemplate(filters));
render(siteMainElement, board.createTemplate());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const tasks = generateTasks(TASK_COUNT);

render(taskListElement, taskEdit.createTemplate(tasks[0]));

tasks.slice(1, SHOWING_TASKS_COUNT_ON_START).forEach((item) => render(taskListElement, task.createTemplate(item), `beforeend`));

render(taskListElement, loadMenuButton.createTemplate(), `afterend`);

const loadMoreButton = siteMainElement.querySelector(`.load-more`);

let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

loadMoreButton.addEventListener(`click`, () => {
  tasks.slice(showingTaskCount, showingTaskCount + SHOWING_TASKS_COUNT_ON_BUTTON)
    .forEach((item) => render(taskListElement, task.createTemplate(item), `beforeend`));

  showingTaskCount += SHOWING_TASKS_COUNT_ON_BUTTON;

  if (showingTaskCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
