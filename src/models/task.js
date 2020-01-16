export default class Task {
  constructor(task) {
    this.id = task[`id`];
    this.description = task[`description`] || ``;
    this.dueDate = task[`due_date`] ? new Date(task[`due_date`]) : null;
    this.tags = new Set(task[`tags`] || []);
    this.repeatingDays = task[`repeating_days`];
    this.color = task[`color`];
    this.isFavorite = Boolean(task[`is_favorite`]);
    this.isArchive = Boolean(task[`is_archived`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'description': this.description,
      'due_date': this.dueDate ? this.dueDate.toISOString() : null,
      'tags': Array.from(this.tags),
      'repeating_days': this.repeatingDays,
      'color': this.color,
      'is_favorite': this.isFavorite,
      'is_archived': this.isArchive,
    };
  }

  static parseTask(task) {
    return new Task(task);
  }

  static parseTasks(tasks) {
    return tasks.map((task) => Task.parseTask(task));
  }

  static clone(task) {
    return new Task(task.toRAW());
  }
}
