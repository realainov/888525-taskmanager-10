import BoardComponent from './components/board';
import FilterComponent from './components/filter';
import SiteMenuComponent from './components/site-menu';
import BoardController from './controllers/board.js';
import {generateFilters} from './data/filter';
import {generateTasks} from './data/task';
import {render} from './utils/render';

const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const filters = generateFilters();

const siteMenuComponent = new SiteMenuComponent();
const filterComponent = new FilterComponent(filters);
const boardComponent = new BoardComponent();

render(siteHeaderElement, siteMenuComponent);
render(siteMainElement, filterComponent);
render(siteMainElement, boardComponent);

const tasks = generateTasks(TASK_COUNT);

const boardController = new BoardController(boardComponent);

boardController.render(tasks);
