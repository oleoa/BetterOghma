import LocalStorage from '../helpers/LocalStorage';

type CallbackFunction = (element: Element) => void;

export default abstract class MainController
{
  protected readonly AVARAGE_DECIMAL_PARTS = 2;

  protected storage: LocalStorage
  protected url: string

  constructor(url: string)
  {
    this.url = url;
    this.storage = new LocalStorage();
    this.load();
  }

  protected abstract load(): void;

  protected hide = function(element: HTMLElement): void
  {
    element.style.display = "none";
  }

  protected grid = function(element: HTMLElement): void
  {
    element.style.display = "grid";
  }

  protected flex = function(element: HTMLElement): void
  {
    element.style.display = "flex";
  }

  protected async get(pattern: string, callback: CallbackFunction)
  {
    let element = document.querySelector(pattern);

    if(!element)
      return;

    callback(element);
  }

  protected async getAll(pattern: string, callback: CallbackFunction)
  {
    let element = document.querySelectorAll(pattern);
  
    if(!element)
      return;
  
    for(var i = 0; i < element.length; i++)
      callback(element[i]);
  }

  protected async getByClass(className: string, callback: CallbackFunction)
  {
    let element = document.getElementsByClassName(className);

    if(!element)
      return;

    for(var i = 0; i < element.length; i++)
      callback(element[i]);
  }

  protected async getByText(text: string, callback: CallbackFunction)
  {
    var elements = document.getElementsByTagName("*");

    for (var i = 0; i < elements.length; i++)
      if (elements[i].textContent === text)
        callback(elements[i]);
  }
}
