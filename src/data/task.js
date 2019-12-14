import {colors, days} from '../const';

const descriptions = new Set([
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
]);

const generateDate = () => {
  const date = new Date();

  date.setDate(date.getDate() + generateNumber(-7, 7));

  return date;
};

const generateRepeatingDays = (isRandom) => {
  const repeatDays = {};

  days.forEach((item) => {
    repeatDays[item] = isRandom ? Math.random() > 0.5 : false;
  });

  return repeatDays;
};

const tags = [
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`
];

const generateTags = () => {
  return tags
    .filter(() => Math.random() > 0.5)
    .slice(0, 3);
};

const generateNumber = (min, max) => {
  return Math.floor(min + (max + 1 - min) * Math.random());
};

const getRandomArrayItem = (array) => {
  return array[generateNumber(0, array.length)];
};

const generateTask = () => {
  const dueDate = Math.random() > 0.5 ? null : generateDate();

  return {
    description: getRandomArrayItem(descriptions),
    dueDate,
    repeatingDays: dueDate ? generateRepeatingDays(false) : generateRepeatingDays(true),
    tags: new Set(generateTags()),
    color: getRandomArrayItem(colors),
    isFavorite: Math.random() > 0.5,
    isArchive: Math.random() > 0.5,
  };
};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};

export {generateTasks};
