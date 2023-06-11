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
    this.getByText("Inscrições nos Exames", this.hide);
    this.getByClass("events announcements", this.hide);
    this.getByText("Importante!", this.hide);
  }

  protected abstract index(): void;

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

  protected setDecrescent(): void
  {
    this.getByClass("nav pull-right", (element: HTMLElement) => {
      element.style.display = "flex";
      element.style.alignItems = "center";
    });
    
    this.getByClass("nav pull-right", (element: HTMLElement) => {

      if(document.querySelector("#decrease"))
        return;

      const Checkbox = () => (
        <input id="decrease" type="checkbox" checked={this.storage.check("DECREASE", "true")} onclick={ () => {
          this.storage.set('DECREASE', this.storage.check("DECREASE", "true")?"false":"true");
          this.index();
        }}/>
      );

      const Text = () => (
        <span style="padding: 1rem;">
          Ordem decrescente
        </span>
      );

      const Li = () => (
        <li style="display: flex; order: -1">
          <Text />
          <Checkbox />
        </li>
      );
    
      element.append(VM.m(<Li />));
    });
  }
}
