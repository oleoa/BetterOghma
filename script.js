// ==UserScript==
// @name        Better Oghma
// @namespace   Violentmonkey Scripts
// @match       https://oghma.epcc.pt/*
// @grant       none
// @version     1.0
// @author      -
// @description 07/06/2023, 11:03:25
// ==/UserScript==

var defaultCallBack = function(element){}
var hide = function(element)
{
  element.style.display = "none";
}
var grid = function(element)
{
  element.style.display = "grid";
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

function getByClass(className, callback = defaultCallBack)
{
  let element = document.getElementsByClassName(className);

  if(!element)
    return;

  for(var i = 0; i < element.length; i++)
    callback(element[i]);
}

function getByText(text, callback = defaultCallBack)
{
  var elements = document.getElementsByTagName("*");

  for (var i = 0; i < elements.length; i++)
    if (elements[i].textContent === text)
      callback(elements[i]);
}

var url = window.location.href;
var page = url.split("/")[url.split("/").length-1];
console.log(page);
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
            element.style.order = '-'+sons[i].textContent;
            if(element.className == "header")
              element.style.order = '-21';
          }
          if(i > 2)
            hide(sons[i]);
        }

      element.style.gridTemplateColumns = "40% 40% 20%";

    });

    break;
}

// -------------------------------------------------- Alertas de Exames --------------------------------------------------
getByText("Inscrições nos Exames", hide);
getByClass("events announcements", hide);
getByText("Importante!", hide);
