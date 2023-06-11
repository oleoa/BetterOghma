import './app';
import Evaluations from './controllers/Evaluations';
import MainController from './controllers/MainController';
import Subscriptions from './controllers/Subscriptions';

// setItem("DECREASE", getItem("DECREASE", "true"));

let url = window.location.href;
let urlArray = url.split("/");
let page = urlArray[urlArray.length-1].replace(/#/g, "");
let routes = 
{
  dashboard: MainController,
  evaluations: Evaluations,
  subscriptions: Subscriptions,
}
let controller = new routes[page](urlArray, page);
controller.index();
