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
const AVARAGE_DECIMAL_PARTS = 2;
const DECREASE = true;

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

var url = window.location.href;
var page = url.split("/")[url.split("/").length-1];
switch(page)
{

  // -------------------------------------------------- Avaliações --------------------------------------------------

  case 'evaluations':

    get("tbody", grid);
    getAll("tr", grid);

    getAll("tr", function(element){

      let sons = element.querySelectorAll(element.className == "header" ? "th" : "td");
        for(var i = 0; i < sons.length; i++)
        {
          sons[i].style.display = "flex";
          if(i == 2){
            sons[i].style.justifyContent = "end";
            element.style.order = (DECREASE?'-':'')+sons[i].textContent;
            if(element.className == "header")
              element.style.order = '-21';
          }
          if(i > 2)
            hide(sons[i]);
        }

      element.style.gridTemplateColumns = "40% 40% 20%";

    });

    getByClass("well clearfix", function(element){
      var avarage = getAvarage(document);
      var averageElement = document.createElement("p");
      averageElement.textContent = "O aluno tem uma média de "+avarage.toFixed(AVARAGE_DECIMAL_PARTS)+" pontos";
      element.appendChild(averageElement);
    });

    break;

  // -------------------------------------------------- Pessoas --------------------------------------------------

  case 'subscriptions':

    getByClass("student active", function(element){
      element.querySelectorAll("a").forEach(function(a){a.href+="/evaluations";})
    });

    getAll(".student:not(.active)", hide);

    getByClass("users-list photo", flex);

    getByClass("users-list photo", function(element){
      element.style.flexWrap = "wrap";
    });

    let done = 0;
    let avarages = {};
    getByClass("student active", async function(element){

      var id = element.querySelector("a").href.split("/")[4];
      var evaluationsURL = "https://oghma.epcc.pt/users/"+id+"/evaluations";
      var avarage = 0;
      await fetch(evaluationsURL).then(async html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(await html.text(), 'text/html');
        avarage = getAvarage(doc);

        element.style.order = (DECREASE?'-':'')+(avarage*1000).toFixed(0);
        avarages[id] = avarage;
        var averageElement = document.createElement("p");
        averageElement.textContent = "Média de "+avarage.toFixed(AVARAGE_DECIMAL_PARTS)+" pontos";
        element.appendChild(averageElement);
        done++;
      });
    });

    break;
}

// -------------------------------------------------- Alertas de Exames --------------------------------------------------

getByText("Inscrições nos Exames", hide);
getByClass("events announcements", hide);
getByText("Importante!", hide);
