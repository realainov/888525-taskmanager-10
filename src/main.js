import API from './api.js';
import TasksModel from './models/tasks';
import BoardComponent from './components/board';
import SiteMenuComponent, {MenuItem} from './components/site-menu';
import StatisticsComponent from './components/statistics';
import FilterController from './controllers/filter';
import BoardController from './controllers/board';
import {render} from './utils/render';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/task-manager`;

const api = new API(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasksModel = new TasksModel();

const dateTo = new Date();

const dateFrom = (() => {
  const date = new Date(dateTo);

  date.setDate(date.getDate() - 7);

  return date;
})();

const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});

const filterController = new FilterController(siteMainElement, tasksModel);

filterController.render();

const siteMenuComponent = new SiteMenuComponent();
const boardComponent = new BoardComponent();

render(siteHeaderElement, siteMenuComponent);
render(siteMainElement, boardComponent);
render(siteMainElement, statisticsComponent);

const boardController = new BoardController(boardComponent, tasksModel, api);

statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);

      statisticsComponent.hide();

      boardController.show();
      boardController.createTask();

      break;
    case MenuItem.STATISTICS:
      boardController.hide();

      statisticsComponent.show();

      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();

      boardController.show();

      break;
  }
});

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  });
