import './app';
import Evaluations from './controllers/Evaluations';
import Subscriptions from './controllers/Subscriptions';
import Default from './controllers/Default';

// setItem("DECREASE", getItem("DECREASE", "true"));

let url = window.location.href;
let urlArray = url.split("/");
let page = urlArray[urlArray.length-1].replace(/#/g, "");
let routes = 
{
  default: Default,
  evaluations: Evaluations,
  subscriptions: Subscriptions,
}

if(!routes[page])
  page = 'default';

let controller = new routes[page](urlArray);
controller.index();
