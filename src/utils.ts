type GetCallback<T extends HTMLElement = HTMLElement> = (el: T) => unknown;

export const hide: GetCallback = (element) => (element.style.display = 'none');
export const grid: GetCallback = (element) => (element.style.display = 'grid');
export const flex: GetCallback = (element) => (element.style.display = 'flex');

export function get<T extends HTMLElement = HTMLElement>(
  pattern: string,
  callback: GetCallback
) {
  const element = document.querySelector<T>(pattern);

  if (element === null) {
    return;
  }

  callback(element);
}

export function getAll<T extends HTMLElement = HTMLElement>(
  pattern: string,
  callback: GetCallback
) {
  const element = document.querySelectorAll<T>(pattern);

  for (const i of element) {
    callback(i);
  }
}

export function getByClass(className: string, callback: GetCallback) {
  const element = document.getElementsByClassName(className);

  for (const i of element) {
    callback(<HTMLElement>i);
  }
}

export function getByText(text: string, callback: GetCallback) {
  const elements = document.getElementsByTagName('*');

  for (const i of elements) {
    if (i.textContent === text) {
      callback(<HTMLElement>i);
    }
  }
}
