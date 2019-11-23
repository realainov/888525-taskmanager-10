import {board} from './components/board.js';
import {filter} from './components/filter.js';
import {loadMenuButton} from './components/load-menu-button.js';
import {siteMenu} from './components/site-menu.js';
import {task} from './components/task.js';
import {taskEdit} from './components/task-edit.js';

const TASK_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, siteMenu.createTemplate());
render(siteMainElement, filter.createTemplate());
render(siteMainElement, board.createTemplate());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);

render(taskListElement, taskEdit.createTemplate());

new Array(TASK_COUNT).fill(``).forEach(() => render(taskListElement, task.createTemplate()));

render(taskListElement, loadMenuButton.createTemplate(), `afterend`);
