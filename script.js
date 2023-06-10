// ==UserScript==
// @name        BetterOghma
// @namespace   Violentmonkey Scripts
// @match       https://oghma.epcc.pt/*
// @grant       none
// @version     1.0
// @author      -
// @description 07/06/2023, 11:03:25
// ==/UserScript==

// -------------------------------------------------- Configurações --------------------------------------------------
let AVARAGE_DECIMAL_PARTS = 2;
let DECREASE = localStorage.getItem("DECREASE") ?? "true";
if(!localStorage.getItem("DECREASE"))
  localStorage.setItem("DECREASE", "true")

var defaultCallBack = function(element){}
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

let sites =
{
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
          element.style.order = (DECREASE==="true"?'-':'')+(avarage*1000).toFixed(0);
          var averageElement = document.createElement("p");
          averageElement.textContent = "Média de "+avarage.toFixed(AVARAGE_DECIMAL_PARTS)+" pontos";
          element.appendChild(averageElement);
        });
      else
      {
        var totalAvarage = avarageSum/totalStudents;
        element.querySelector("p").textContent = "Média de "+totalAvarage.toFixed(AVARAGE_DECIMAL_PARTS)+" pontos";
        element.style.order = (DECREASE==="true"?'-':'')+(totalAvarage*1000).toFixed(0);
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
  },

  evaluations: function()
  {
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
              element.style.order = (DECREASE==="true"?'-':'')+sons[i].textContent;
            if(i > 3)
              hide(sons[i]);
          }
        }

      element.style.gridTemplateColumns = "30% 50% 10% 10%";

    });

    getByClass("well clearfix", function(element){
      var avarage = getAvarage(document);
      if(document.getElementById("alunoAvarageText"))
        return;

      var averageElement = document.createElement("p");
      averageElement.id = "alunoAvarageText";
      averageElement.innerHTML = "O aluno tem uma média de "+avarage.toFixed(AVARAGE_DECIMAL_PARTS)+" pontos";
      element.appendChild(averageElement);
    });
  }
}

// -------------------------------------------------- Alertas de Exames --------------------------------------------------

getByText("Inscrições nos Exames", hide);
getByClass("events announcements", hide);
getByText("Importante!", hide);

// -------------------------------------------------- Main --------------------------------------------------

var url = window.location.href;
var page = url.split("/")[url.split("/").length-1];
page = page.replace(/#/g, "");

getByClass("nav pull-right", function(element){
  element.style.display = "flex";
  element.style.alignItems = "center";
});

getByClass("nav pull-right", function(element){
  var li = document.createElement("li");
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  if(DECREASE === "true")
    checkbox.checked = true;
  checkbox.onclick = function(){
    DECREASE = DECREASE === "true" ? "false" : "true";
    localStorage.setItem('DECREASE', DECREASE === "true" ? "true" : "false");
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

sites[page]();
