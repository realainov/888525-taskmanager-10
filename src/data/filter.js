const filterTitles = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];

const generateFilters = () => {
  return filterTitles.map((item) => {
    return {
      title: item,
      count: Math.floor(Math.random() * 10)
    };
  });
};

export {generateFilters};
