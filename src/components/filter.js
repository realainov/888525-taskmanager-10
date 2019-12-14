const createFilterMarkup = (filter, isChecked) => {
  const {title, count} = filter;

  return (
    `<input
        type="radio"
        id="filter__${title}"
        class="filter__input visually-hidden"
        name="filter"
        ${isChecked ? `checked` : ``}
      />
      <label for="filter__${title}" class="filter__label">
        ${name} <span class="filter__${title}-count">${count}</span>
      </label>`
  );
};

const createTemplate = (filters) => {
  const filtersMarkup = filters.map((item, i) => createFilterMarkup(item, i === 0)).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

export const filter = {
  createTemplate
};
