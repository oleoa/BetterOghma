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
}
