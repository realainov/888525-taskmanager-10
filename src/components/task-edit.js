import AbstractSmartComponent from './abstract-smart-component';
import {COLORS, DAYS} from '../const.js';
import {formatTime, formatDate} from '../utils/common.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

const createColorsMarkup = (colors, currentColor) => {
  return colors
    .map((color) => {
      return (
        `<input
          type="radio"
          id="color-${color}-4"
          class="card__color-input card__color-input--${color} visually-hidden"
          name="color"
          value="${color}"
          ${currentColor === color ? `checked` : ``}
        >
        <label
          for="color-${color}-4"
          class="card__color card__color--${color}"
          >${color}</label
        >`
      );
    })
    .join(`\n`);
};

const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days
    .map((day) => {
      const isChecked = repeatingDays[day];
      return (
        `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-4"
          name="repeat"
          value="${day}"
          ${isChecked ? `checked` : ``}
        >
        <label class="card__repeat-day" for="repeat-${day}-4"
          >${day}</label
        >`
      );
    })
    .join(`\n`);
};

const createTagsMarkup = (tags) => {
  return Array.from(tags)
    .map((tag) => {
      return (
        `<span class="card__hashtag-inner">
          <input type="hidden"
            name="hashtag"
            value=${tag}
            class="card__hashtag-hidden-input"
          >
          <p class="card__hashtag-name">
            #${tag}
          </p>
          <button
              type="button"
              class="card__hashtag-delete"
          >
            delete
          </button>
        </span>`
      );
    })
    .join(`\n`);
};

const createTemplate = (task, options) => {
  const {description, tags, color} = task;
  const {isDateShowing, isRepeatingTask, repeatingDays, dueDate} = options;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isDisabledSaveButton = (isDateShowing && !dueDate || isRepeatingTask && !isRepeating(repeatingDays));

  const date = (isDateShowing && dueDate) ? formatDate(dueDate) : ``;
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;

  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const tagsMarkup = createTagsMarkup(tags);
  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, repeatingDays);

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>

                ${isDateShowing ? `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${date} ${time}"
                    />
                  </label>
                </fieldset>` : ``}

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                </button>

                ${isRepeatingTask ? `<fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    ${repeatingDaysMarkup}
                  </div>
                </fieldset>` : ``}
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${tagsMarkup}
                </div>

                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isDisabledSaveButton ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEditComponent extends AbstractSmartComponent {
  constructor(task) {
    super();

    this._task = task;

    this._options = {
      isDateShowing: !!task.dueDate,
      isRepeatingTask: Object.values(task.repeatingDays).some(Boolean),
      repeatingDays: Object.assign({}, task.repeatingDays),
      dueDate: task.dueDate
    };

    this._flatpickr = null;
    this._editFormClickHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTemplate(this._task, this._options);
  }

  recoveryEventListeners() {
    this.setEditFormSubmitHandler(this._editFormClickHandler);

    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const task = this._task;

    this._options = {
      isDateShowing: !!task.dueDate,
      isRepeatingTask: Object.values(this._task.repeatingDays).some(Boolean),
      repeatingDays: Object.assign({}, this._task.repeatingDays),
      dueDate: task.dueDate
    };

    this.rerender();
  }

  setEditFormSubmitHandler(handler) {
    this.findElement(`form`).addEventListener(`submit`, handler);

    this._editFormClickHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._options.isDateShowing) {
      const dateElement = this.findElement(`.card__date`);

      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._options.dueDate
      });
    }
  }

  _subscribeOnEvents() {
    this.findElement(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      this._options.isDateShowing = !this._options.isDateShowing;

      this.rerender();
    });

    const dateElement = this.findElement(`.card__date`);

    if (dateElement !== null) {
      dateElement.addEventListener(`change`, () => {
        this._options.dueDate = this._flatpickr.selectedDates[0];

        this.rerender();

        this._flatpickr.setDate(this._options.dueDate);
      });
    }

    this.findElement(`.card__repeat-toggle`).addEventListener(`click`, () => {
      this._options.isRepeatingTask = !this._options.isRepeatingTask;

      this.rerender();
    });

    const repeatDaysElement = this.findElement(`.card__repeat-days`);

    if (repeatDaysElement) {
      repeatDaysElement.addEventListener(`change`, (evt) => {
        this._options.repeatingDays[evt.target.value] = evt.target.checked;

        this.rerender();
      });
    }
  }
}
