import MainController from "./MainController";

export default class Default extends MainController
{
  async index()
  {
    console.log("Welcome to BetterOghma");
  }

  protected load(): void 
  {
    this.getByText("Inscrições nos Exames", this.hide);
    this.getByClass("events announcements", this.hide);
    this.getByText("Importante!", this.hide);
    this.getByClass("well clearfix", element => {
      const App = () => (
        <div>
          <h1>Hello, React in Violentmonkey!</h1>
        </div>
      );
      element.append(VM.m(<App />));
    });
  }
}
