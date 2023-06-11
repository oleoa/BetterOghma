import MainController from "./MainController";

export default class Subscriptions extends MainController
{
  async index()
  {
    this.getByClass("student active", element => {
      element.querySelectorAll("a").forEach(function(a){a.href+="/evaluations";})
    });

    this.getAll(".student:not(.active)", this.hide);

    this.getByClass("users-list photo", this.flex);

    this.getByClass("users-list photo", (element: HTMLElement) => {
      element.style.flexWrap = "wrap";
    });

    let avarageSum = 0;
    let totalStudents = 0;
    this.getByClass("student active", async (element: HTMLElement) => {
      var id = element.querySelector("a").href.split("/")[4];
      var evaluationsURL = "https://oghma.epcc.pt/users/"+id+"/evaluations";
      if(id)
        await fetch(evaluationsURL).then(async html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(await html.text(), 'text/html');
          var avarage = this.getAvarage(doc);
          avarageSum += avarage;
          totalStudents++;
          element.style.order = (this.storage.check("DECREASE", "true")?'-':'')+(avarage*1000).toFixed(0);
          var averageElement = document.createElement("p");
          averageElement.textContent = "Média de "+avarage.toFixed(this.AVARAGE_DECIMAL_PARTS)+" pontos";
          element.appendChild(averageElement);
        });
      else
      {
        var totalAvarage = avarageSum/totalStudents;
        element.querySelector("p").textContent = "Média de "+totalAvarage.toFixed(this.AVARAGE_DECIMAL_PARTS)+" pontos";
        element.style.order = (this.storage.check("DECREASE", "true")?'-':'')+(totalAvarage*1000).toFixed(0);
      }
    });

    this.getByClass("users-list photo", function(element){
      var avarageStudent = document.createElement("li");
      var imageA = document.createElement("a");
      var image = document.createElement("img");
      var br = document.createElement("br");
      var span = document.createElement("span");
      var a = document.createElement("a");
      var p = document.createElement("p");

      avarageStudent.className = "student active";
      image.src = "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";
      image.style.height = "79px";
      image.style.width = "auto";
      span.textContent = "Média";
      a.textContent = "Aluno Médio";

      imageA.appendChild(image);
      avarageStudent.appendChild(imageA);
      avarageStudent.appendChild(span);
      avarageStudent.appendChild(br);
      avarageStudent.appendChild(a);
      avarageStudent.appendChild(p);
      element.appendChild(avarageStudent);
    });
  }

  private getAvarage(page)
  {
    var avarage = 0;
    var sumAll = 0;
    var countAll = 0;
    page.querySelectorAll("tr").forEach(tr => {
      if(tr.className != "header"){
        var tds = tr.querySelectorAll("td");
        sumAll += parseInt(tds[2].textContent);
        countAll++;
      }
    });
    avarage = sumAll / countAll;
    return avarage;
  }
}