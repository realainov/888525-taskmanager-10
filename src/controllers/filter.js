import FilterComponent from '../components/filter';
import {render, replace} from '../utils/render';
import {getTasksByFilter} from '../utils/filter';
import {FilterType} from '../const';

export default class FilterController {
  constructor(containerElement, tasksModel) {
    this._containerElement = containerElement;
    this._tasksModel = tasksModel;

    this._activeFilterType = FilterType.ALL;

    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tasksModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const allTasks = this._tasksModel.getTasksAll();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);

    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._containerElement, this._filterComponent);
    }
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._tasksModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
