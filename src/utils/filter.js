import {isRepeating, isOneDay, isOverdueDate} from './common.js';
import {FilterType} from '../const.js';

export const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

export const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

export const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

export const getOverdueTasks = (tasks) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return isOverdueDate(dueDate);
  });
};

export const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => isRepeating(task.repeatingDays));
};

export const getTasksWithTags = (tasks) => {
  return tasks.filter((task) => task.tags.size);
};

export const getTasksInOneDay = (tasks) => {
  return tasks.filter((task) => isOneDay(task.dueDate));
};

export const getTasksByFilter = (tasks, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return getNotArchiveTasks(tasks);
    case FilterType.ARCHIVE:
      return getArchiveTasks(tasks);
    case FilterType.FAVORITES:
      return getFavoriteTasks(getNotArchiveTasks(tasks));
    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(tasks));
    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(tasks));
    case FilterType.TAGS:
      return getTasksWithTags(getNotArchiveTasks(tasks));
    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchiveTasks(tasks));
  }

  return tasks;
};
