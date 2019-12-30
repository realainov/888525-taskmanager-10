export const remove = (component) => {
  component.getElement().remove();

  component.removeElement();
};

export const render = (container, component, place) => {
  switch (place) {
    case `beforebegin`:
      container.before(component.getElement());
      break;
    case `afterbegin`:
      container.prepend(component.getElement());
      break;
    case `afterend`:
      container.after(component.getElement());
      break;
    default:
      container.append(component.getElement());
      break;
  }
};

export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
