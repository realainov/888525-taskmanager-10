import TasksModel from './models/tasks';
import BoardComponent from './components/board';
import SiteMenuComponent from './components/site-menu';
import FilterController from './controllers/filter';
import BoardController from './controllers/board';
import {generateTasks} from './data/task';
import {render} from './utils/render';

const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);

const tasksModel = new TasksModel();

tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);

filterController.render();

const siteMenuComponent = new SiteMenuComponent();
const boardComponent = new BoardComponent();

render(siteHeaderElement, siteMenuComponent);
render(siteMainElement, boardComponent);

siteMenuComponent.getElement().querySelector(`.control__label--new-task`).addEventListener(`click`, () => {
  boardController.createTask();
});

const boardController = new BoardController(boardComponent, tasksModel);

boardController.render();
