import MainController from "./MainController";
import Subject from "../models/Subject";

export default class Evaluations extends MainController
{
  private subjects: Subject[];

  async index()
  {
    this.setDecrescent();
    this.subjects = [];

    // Verifica em qual user está salvo a atual data
    if(!this.storage.check("lastUser", this.url[4])){
      const itemToKeep = "decrease";
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key != itemToKeep) {
          localStorage.removeItem(key);
        }
      }
      this.storage.set("lastUser", this.url[4]);
    }

    // CSS
    this.get("tbody", this.grid);
    this.getAll("tr", this.grid);
    this.getAll("tr", (element: HTMLElement) => {
      let sons = element.querySelectorAll(element.className == "header" ? "th" : "td");
        for(var i = 0; i < sons.length; i++)
        {
          sons[i].style.display = "flex";
          if(element.className == "header")
          {
            element.style.order = '-21';
            if(i == 0)
              sons[i].style.gridColumn = "span 2 / span 2";
            if(i > 0)
              sons[i].style.justifyContent = "end";
            if(i > 2)
              this.hide(sons[i]);
          }
          else
          {
            if(i > 1)
              sons[i].style.justifyContent = "end";
            if(i == 2)
              element.style.order = (this.storage.check("DECREASE", "true")?'-':'')+sons[i].textContent;
            if(i > 3)
              this.hide(sons[i]);
          }
        }
      element.style.gridTemplateColumns = "30% 50% 10% 10%";
    });

    // Pega o id do curso
    let coursesURL = "https://oghma.epcc.pt/users/"+this.url[4]+"/subscriptions";
    let courseId;
    await fetch(coursesURL).then(async html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(await html.text(), 'text/html');
      let tr = doc.querySelector("tbody > tr");
      courseId = tr.querySelectorAll("td")[1].querySelector("a").href.split("/")[4];
    });

    // Salva todas as notas
    if(!this.storage.check("allSubjectsSet", "true"))
    {
      let userh1 = document.getElementsByClassName("well clearfix")[0].querySelector("h1");
      var smallElement = userh1.querySelector('small');
      var smallText = smallElement.textContent;
      let username = userh1.textContent.substring(smallText.length);
      let allSubjects = await this.getAllSubjectsFromCourse(courseId);
      
      for(var i = 0; i < allSubjects.names.length; i++)
      {
        let subject = new Subject();
        subject.setName(allSubjects.names[i]);
        subject.setId(allSubjects.ids[subject.getName()]);
        let evaluation = await this.getEvaluationByUsername(username, subject.getId());
        subject.setEvaluation(evaluation);
        this.subjects.push(subject);
      }

      this.subjects.forEach((subject, i) => {
        this.storage.set(i.toString(), subject.getName().toString());
        this.storage.set(subject.getName()+"_id", subject.getId().toString());
        this.storage.set(subject.getName()+"_evaluation", subject.getEvaluation().toString());
        this.storage.set(subject.getName()+"_isActived", "true");
      })

      this.storage.set("allSubjectsSet", "true");
      this.storage.set("subjectsLength", this.subjects.length.toString());
    }
    else
    {
      for(var i = 0; i < parseFloat(this.storage.get("subjectsLength")); i++)
      {
        let subject = new Subject();

        let name = this.storage.get(i.toString());
        subject.setName(name);

        let id = this.storage.get(name+"_id");
        subject.setId(parseFloat(id));

        let evaluation = this.storage.get(name+"_evaluation");
        subject.setEvaluation(parseFloat(evaluation));

        this.subjects.push(subject);
      }
    }
    
    await this.getByClass("well clearfix", async element => {
      let avarageSubjectSum = 0;
      let subjectsCount = 0;
      this.subjects.forEach(subject => {
        if(!isNaN(subject.getEvaluation()) && this.storage.check(subject.getName()+"_isActived", "true")){
          subjectsCount++;
          avarageSubjectSum += subject.getEvaluation();
        }
      });
      let avarage = (avarageSubjectSum/subjectsCount).toFixed(this.AVARAGE_DECIMAL_PARTS);

      var averageElement = null;
      if(document.getElementById("alunoAvarageText"))
        averageElement = document.getElementById("alunoAvarageText");
      else
      {
        averageElement = document.createElement("p");
        averageElement.id = "alunoAvarageText";
      }

      averageElement.innerHTML = "O aluno tem uma média de "+avarage+" pontos";

      if(!document.getElementById("alunoAvarageText"))
        element.appendChild(averageElement);
    });

    this.getByClass("span2 sidebar", element => {
      if(document.getElementById("evaluationsCheckers"))
        return;
      var div = document.createElement("div");
      div.id = "evaluationsCheckers";
      div.style.paddingLeft = "0.8rem";
      div.style.paddingRight = "0.8rem";

      element.appendChild(div);

      this.subjects.forEach(subject => {

        var subjectElementDiv = document.createElement("div");
        subjectElementDiv.style.display = "flex";
        subjectElementDiv.style.flexDirection = "row";
        subjectElementDiv.style.alignItems = "center";
        subjectElementDiv.style.justifyContent = "start";
        subjectElementDiv.style.padding = "0.25rem";

        var subjectElementCheckbox = document.createElement("input");
        subjectElementCheckbox.type = "checkbox";
        subjectElementCheckbox.id = subject.getName()+"_checkbox";

        if(this.storage.check(subject.getName()+"_isActived", "true"))
          subjectElementCheckbox.checked = true;

        subjectElementCheckbox.onclick = () => {
          this.storage.set(subject.getName()+"_isActived", this.storage.check(subject.getName()+"_isActived", "true")?"false":"true");
          this.index();
        }

        var subjectElementText = document.createElement("label");
        subjectElementText.style.fontSize = "0.8rem";
        subjectElementText.style.marginBottom = "0rem";
        subjectElementText.style.userSelect = "none";
        subjectElementText.htmlFor = subject.getName()+"_checkbox";
        subjectElementText.innerHTML = subject.getName() == "Tecnologias de Informação e Comunicação" ? "TIC" : subject.getName();
        subjectElementText.style.paddingLeft = "0.5rem";

        var subjectAvarageScore = document.createElement("span");
        subjectAvarageScore.innerHTML = subject.getEvaluation().toString();
        subjectAvarageScore.style.paddingLeft = "0.5rem";

        subjectElementDiv.appendChild(subjectElementCheckbox);
        subjectElementDiv.appendChild(subjectElementText);
        subjectElementDiv.appendChild(subjectAvarageScore);
        div.appendChild(subjectElementDiv);
      });

    });
  }

  private async getAllSubjectsFromCourse(id: number)
  {
    let couseURL = "https://oghma.epcc.pt/courses/"+id;
    let subjects =
    {
      ids: {},
      names: []
    };
  
    await fetch(couseURL).then(async html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(await html.text(), 'text/html');
      let trs = doc.querySelectorAll("tbody > tr");
      trs.forEach(function(tr){
        let td = tr.querySelector("td");
        let subject = td.querySelector("a");
        let subjectTitle = subject.textContent;
        if (subjectTitle.endsWith(" ")) {
          subjectTitle = subjectTitle.trimEnd();
        }
        let subjectId = subject.href.split("/")[4];
        subjects.ids[subjectTitle] = parseFloat(subjectId);
        subjects.names.push(subjectTitle);
      });
    });
  
    return subjects;
  }

  private async getEvaluationByUsername(username: string, subjectId: number)
  {
    let subjectEvaluationsURL = "https://oghma.epcc.pt/units/"+subjectId+"/evaluations";
    let evaluation = 0;

    await fetch(subjectEvaluationsURL).then(async html => {

      const parser = new DOMParser();
      const doc = parser.parseFromString(await html.text(), 'text/html');

      let trs = doc.querySelectorAll("tbody > tr");
      trs.forEach(function(tr){
        let tds = tr.querySelectorAll("td");
        if(tds.length > 0)
          if(tds[1].textContent.replace(/\s/g, "").toLowerCase() == username.replace(/\s/g, "").toLowerCase())
          evaluation = parseFloat(tds[2].textContent.split(" ")[0]);
      });
    });

    return evaluation;
  }

  protected load(): void
  {
    this.getByText("Inscrições nos Exames", this.hide);
    this.getByClass("events announcements", this.hide);
    this.getByText("Importante!", this.hide);

    this.getByClass("nav pull-right", (element: HTMLElement) => {
      element.style.display = "flex";
      element.style.alignItems = "center";
    });
    
    this.getByClass("nav pull-right", (element: HTMLElement) => {
      var li = document.createElement("li");
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      if(this.storage.check("DECREASE", "true"))
        checkbox.checked = true;

      checkbox.onclick = () => {
        this.storage.set('DECREASE', this.storage.check("DECREASE", "true")?"false":"true");
        this.index();
      }

      var text = document.createElement("span");
      text.textContent = "Ordem decrescente";
      text.style.padding = "1rem";
    
      li.style.display = "flex";
      li.appendChild(text);
      li.appendChild(checkbox);
      li.style.order = "-1";
      element.appendChild(li);
    });
  }
}