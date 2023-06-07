// ==UserScript==
// @name        Better Oghma
// @namespace   Violentmonkey Scripts
// @match       https://oghma.epcc.pt/*
// @grant       none
// @version     1.0
// @author      -
// @description 07/06/2023, 11:03:25
// ==/UserScript==

// document.querySelector("body").style.backgroundColor = "black"
function get(pattern)
{
  return document.querySelector(pattern);
}

function getAll(pattern)
{
  return document.querySelectorAll(pattern);
}

function getByClass(className)
{
  return document.getElementsByClassName(className);
}

getByClass("events announcements")[0].style.display = "none";
