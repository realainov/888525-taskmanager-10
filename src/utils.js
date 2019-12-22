const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : `${value}`;
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  const interval = date.getHours() > 11 ? `pm` : `am`;

  return `${hours}:${minutes} ${interval}`;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);

  newElement.insertAdjacentHTML(`beforeend`, template);

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case `beforebegin`:
      container.before(element);
      break;
    case `afterbegin`:
      container.prepend(element);
      break;
    case `afterend`:
      container.after(element);
      break;
    default:
      container.append(element);
      break;
  }
};
