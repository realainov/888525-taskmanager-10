import AbstractComponent from './abstract-component';
import {formatTime, formatDate, isOverdueDate} from '../utils/common';
import he from 'he';

const createTagsMarkup = (tags) => {
  return tags
    .map((item) => {
      return (
        `<span class="card__hashtag-inner">
            <span class="card__hashtag-name">
              #${item}
            </span>
          </span>`
      );
    })
    .join(`\n`);
};

const createButtonMarkup = (name, isActive) => {
  return (
    `<button
      type="button"
      class="card__btn card__btn--${name} ${isActive ? `` : `card__btn--disabled`}"
    >
      ${name}
    </button>`
  );
};

const createTemplate = (task) => {
  const {description: currentDescription, tags, dueDate, color, repeatingDays, isArchive, isFavorite} = task;

  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate);
  const isDateShowing = !!dueDate;

  const date = isDateShowing ? formatDate(dueDate) : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const description = he.encode(currentDescription);

  const tagsMarkup = createTagsMarkup(Array.from(tags));

  const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const editButtonMarkup = createButtonMarkup(`edit`, true);
  const archiveButtonMarkup = createButtonMarkup(`archive`, isArchive);
  const favoritesButtonMarkup = createButtonMarkup(`favorites`, isFavorite);

  return (
    `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            ${editButtonMarkup}
            ${archiveButtonMarkup}
            ${favoritesButtonMarkup}
          </div>
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>
          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>
              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${tagsMarkup}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
};

export default class TaskComponent extends AbstractComponent {
  constructor(task) {
    super();

    this._task = task;
  }

  getTemplate() {
    return createTemplate(this._task);
  }

  setEditButtonClickHandler(handler) {
    this.findElement(`.card__btn--edit`).addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.findElement(`.card__btn--favorites`).addEventListener(`click`, handler);
  }

  setArchiveButtonClickHandler(handler) {
    this.findElement(`.card__btn--archive`).addEventListener(`click`, handler);
  }
}
