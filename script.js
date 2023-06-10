// ==UserScript==
// @name        BetterOghma
// @namespace   Violentmonkey Scripts
// @match       https://oghma.epcc.pt/*
// @grant       none
// @version     1.0
// @author      -
// @description 07/06/2023, 11:03:25
// ==/UserScript==

// -------------------------------------------------- URL --------------------------------------------------

var url = window.location.href;
var urlArray = url.split("/");
var page = urlArray[urlArray.length-1];
page = page.replace(/#/g, "");

// -------------------------------------------------- Funcionalidades Úteis --------------------------------------------------

var defaultCallBack = function(element){}

var setItem = function(key, value)
{
  key = key.toString().toLowerCase().replace(/\s/g, "");;
  value = value.toString().toLowerCase().replace(/\s/g, "");;
  localStorage.setItem(key, value);
}

var getItem = function(key, defaultValue)
{
  key = key.toString().toLowerCase().replace(/\s/g, "");;
  return localStorage.getItem(key) ?? defaultValue;
}

var checkItem = function(key, value)
{
  key = key.toString().toLowerCase().replace(/\s/g, "");;
  value = value.toString().toLowerCase().replace(/\s/g, "");;
  return localStorage.getItem(key) == value;
}

var hide = function(element)
{
  element.style.display = "none";
}
var grid = function(element)
{
  element.style.display = "grid";
}
var flex = function(element)
{
  element.style.display = "flex";
}

function get(pattern, callback = defaultCallBack)
{
  let element = document.querySelector(pattern);

  if(!element)
    return;

  callback(element);
}

function getAll(pattern, callback = defaultCallBack)
{
  let element = document.querySelectorAll(pattern);

  if(!element)
    return;

  for(var i = 0; i < element.length; i++)
    callback(element[i]);
}

async function getByClass(className, callback = defaultCallBack)
{
  let element = document.getElementsByClassName(className);

  if(!element)
    return;

  for(var i = 0; i < element.length; i++)
    await callback(element[i]);
}

function getByText(text, callback = defaultCallBack)
{
  var elements = document.getElementsByTagName("*");

  for (var i = 0; i < elements.length; i++)
    if (elements[i].textContent === text)
      callback(elements[i]);
}

function getAvarage(page)
{
  var avarage = 0;
  var sumAll = 0;
  var countAll = 0;
  page.querySelectorAll("tr").forEach(function(tr){
    if(tr.className != "header"){
      var tds = tr.querySelectorAll("td");
      sumAll += parseInt(tds[2].textContent);
      countAll++;
    }
  });
  avarage = sumAll / countAll;
  return avarage;
}

async function getAllSubjectsFromCourse(id)
{
  let couseURL = "https://oghma.epcc.pt/courses/"+id;
  let data = {};
  data.subjects = [];
  data.ids = {};

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
      data.ids[subjectTitle] = subjectId;
      data.subjects.push(subjectTitle);
    });
  });

  return data;
}

async function getSubjectNyUsername(userName, subjects)
{
  let newSubjects = subjects;
  newSubjects.evaluations = {}

  for(var i = 0; i < newSubjects.subjects.length; i++)
  {
    let subjectEvaluationsURL = "https://oghma.epcc.pt/units/"+newSubjects.ids[newSubjects.subjects[i]]+"/evaluations";

    await fetch(subjectEvaluationsURL).then(async html => {

      const parser = new DOMParser();
      const doc = parser.parseFromString(await html.text(), 'text/html');

      let trs = doc.querySelectorAll("tbody > tr");
      trs.forEach(function(tr){
        let tds = tr.querySelectorAll("td");
        if(tds.length > 0)
          if(tds[1].textContent.replace(/\s/g, "").toLowerCase() == userName.replace(/\s/g, "").toLowerCase())
            newSubjects.evaluations[newSubjects.subjects[i]] = tds[2].textContent.split(" ")[0];
      });
    });
  }

  return newSubjects;
}

// -------------------------------------------------- Configurações --------------------------------------------------

let AVARAGE_DECIMAL_PARTS = 2;
setItem("DECREASE", getItem("DECREASE", "true"));

// -------------------------------------------------- Páginas --------------------------------------------------

let sites =
{
  // -------------------------------------------------- Notas --------------------------------------------------
  evaluations: async function()
  {
    if(!checkItem("lastUser", urlArray[4])){
      const itemToKeep = "decrease";
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key != itemToKeep) {
          localStorage.removeItem(key);
        }
      }
      setItem("lastUser", urlArray[4]);
    }

    get("tbody", grid);
    getAll("tr", grid);

    getAll("tr", function(element){
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
              hide(sons[i]);
          }
          else
          {
            if(i > 1)
              sons[i].style.justifyContent = "end";
            if(i == 2)
              element.style.order = (checkItem("DECREASE", "true")?'-':'')+sons[i].textContent;
            if(i > 3)
              hide(sons[i]);
          }
        }

      element.style.gridTemplateColumns = "30% 50% 10% 10%";

    });

    let subjects = {}
    let coursesURL = "https://oghma.epcc.pt/users/"+urlArray[4]+"/subscriptions";
    let courseId = 0;
    await fetch(coursesURL).then(async html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(await html.text(), 'text/html');
      let tr = doc.querySelector("tbody > tr");
      courseId = tr.querySelectorAll("td")[1].querySelector("a").href.split("/")[4];
    });

    if(!checkItem("allSubjectsSet", "true"))
    {
      let userh1 = document.getElementsByClassName("well clearfix")[0].querySelector("h1");
      var smallElement = userh1.querySelector('small');
      var smallText = smallElement.textContent;
      let userName = userh1.textContent.substring(smallText.length);

      subjects = await getAllSubjectsFromCourse(courseId);
      subjects = await getSubjectNyUsername(userName, subjects);
      for(var i = 0; i < subjects.subjects.length; i++)
      {
        let title = subjects.subjects[i];
        setItem(title, getItem(title, subjects.evaluations[title]));
        setItem(title+"_isActived", getItem(title+"_isActived", "true"));
      }
      setItem("allSubjectsSet", "true");
    }
    else
    {
      subjects = await getAllSubjectsFromCourse(courseId);
      subjects.evaluations = {}
      subjects.subjects.forEach(function(title){
        subjects.evaluations[title] = getItem(title, 0);
      });
    }

    await getByClass("well clearfix", async function(element){

      let avarageSubjectSum = 0;
      let subjectsCount = 0;
      subjects.subjects.forEach(function(title){
        if(subjects.evaluations[title] != "" && checkItem(title+"_isActived", "true")){
          subjectsCount++;
          let evaluation = subjects.evaluations[title];
          evaluation = parseFloat(evaluation);
          avarageSubjectSum += evaluation;
        }
      });
      let avarage = (avarageSubjectSum/subjectsCount).toFixed(AVARAGE_DECIMAL_PARTS);

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

    getByClass("span2 sidebar", function(element){
      if(document.getElementById("evaluationsCheckers"))
        return;
      var div = document.createElement("div");
      div.id = "evaluationsCheckers";
      div.style.paddingLeft = "0.8rem";
      div.style.paddingRight = "0.8rem";
      element.appendChild(div);
      for(var i = 0; i < subjects.subjects.length; i++)
      {
        let title = subjects.subjects[i];

        var subjectElementDiv = document.createElement("div");
        subjectElementDiv.style.display = "flex";
        subjectElementDiv.style.flexDirection = "row";
        subjectElementDiv.style.alignItems = "center";
        subjectElementDiv.style.justifyContent = "start";
        subjectElementDiv.style.padding = "0.25rem";

        var subjectElementCheckbox = document.createElement("input");
        subjectElementCheckbox.type = "checkbox";
        subjectElementCheckbox.id = title+"_checkbox";
        if(checkItem(title+"_isActived", "true"))
          subjectElementCheckbox.checked = "true";
        subjectElementCheckbox.onclick = function(){
          setItem(title+"_isActived", checkItem(title+"_isActived", "true")?"false":"true");
          sites[page]();
        }

        var subjectElementText = document.createElement("label");
        subjectElementText.style.fontSize = "0.8rem";
        subjectElementText.style.marginBottom = "0rem";
        subjectElementText.style.userSelect = "none";
        subjectElementText.htmlFor = title+"_checkbox";
        subjectElementText.innerHTML = title == "Tecnologias de Informação e Comunicação" ? "TIC" : title;
        subjectElementText.style.paddingLeft = "0.5rem";

        var subjectAvarageScore = document.createElement("span");
        subjectAvarageScore.innerHTML = subjects.evaluations[title];
        subjectAvarageScore.style.paddingLeft = "0.5rem";

        subjectElementDiv.appendChild(subjectElementCheckbox);
        subjectElementDiv.appendChild(subjectElementText);
        subjectElementDiv.appendChild(subjectAvarageScore);
        div.appendChild(subjectElementDiv);
      }
    });
  },

  // -------------------------------------------------- Alunos --------------------------------------------------
  subscriptions: function()
  {
    getByClass("student active", function(element){
      element.querySelectorAll("a").forEach(function(a){a.href+="/evaluations";})
    });

    getAll(".student:not(.active)", hide);

    getByClass("users-list photo", flex);

    getByClass("users-list photo", function(element){
      element.style.flexWrap = "wrap";
    });

    let avarageSum = 0;
    let totalStudents = 0;
    getByClass("student active", async function(element){
      var id = element.querySelector("a").href.split("/")[4];
      var evaluationsURL = "https://oghma.epcc.pt/users/"+id+"/evaluations";
      if(id)
        await fetch(evaluationsURL).then(async html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(await html.text(), 'text/html');
          var avarage = getAvarage(doc);
          avarageSum += avarage;
          totalStudents++;
          element.style.order = (checkItem("DECREASE", "true")?'-':'')+(avarage*1000).toFixed(0);
          var averageElement = document.createElement("p");
          averageElement.textContent = "Média de "+avarage.toFixed(AVARAGE_DECIMAL_PARTS)+" pontos";
          element.appendChild(averageElement);
        });
      else
      {
        var totalAvarage = avarageSum/totalStudents;
        element.querySelector("p").textContent = "Média de "+totalAvarage.toFixed(AVARAGE_DECIMAL_PARTS)+" pontos";
        element.style.order = (checkItem("DECREASE", "true")?'-':'')+(totalAvarage*1000).toFixed(0);
      }
    });

    getByClass("users-list photo", function(element){
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
}

// -------------------------------------------------- Alertas de Exames --------------------------------------------------

getByText("Inscrições nos Exames", hide);
getByClass("events announcements", hide);
getByText("Importante!", hide);

// -------------------------------------------------- Main --------------------------------------------------

getByClass("nav pull-right", function(element){
  element.style.display = "flex";
  element.style.alignItems = "center";
});

getByClass("nav pull-right", function(element){
  var li = document.createElement("li");
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  if(checkItem("DECREASE", "true"))
    checkbox.checked = true;
  checkbox.onclick = function(){
    setItem('DECREASE', checkItem("DECREASE", "true")?"false":"true");
    sites[page]();
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

if (typeof sites[page] === 'function') {
  sites[page]();
}
