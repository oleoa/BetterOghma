import MainController from "./MainController";

export default class Default extends MainController
{
  async index()
  {
    this.getByClass("well clearfix", element => {
      const App = () => (
        <div>
          <h1>Welcome to BetterOghma</h1>
        </div>
      );
      element.append(VM.m(<App />));
    });
  }

  protected load(): void 
  {
    this.getByText("Inscrições nos Exames", this.hide);
    this.getByClass("events announcements", this.hide);
    this.getByText("Importante!", this.hide);
  }
}
