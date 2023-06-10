import { checkItem, setItem } from './storage';
import { flex, getByClass, getByText, hide } from './utils';
import { executeSite } from './sites';

getByText('Inscrições nos Exames', hide);
getByClass('events announcements', hide);
getByText('Importante!', hide);

executeSite();

getByClass('nav pull-right', (element) => {
  flex(element);
  element.style.alignItems = 'center';

  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  if (checkItem('DECREASE', 'true')) checkbox.checked = true;
  checkbox.onclick = function () {
    setItem('DECREASE', checkItem('DECREASE', 'true') ? 'false' : 'true');
    executeSite();
  };
  const text = document.createElement('span');
  text.textContent = 'Ordem decrescente';
  text.style.padding = '1rem';

  li.style.display = 'flex';
  li.appendChild(text);
  li.appendChild(checkbox);
  li.style.order = '-1';
  element.appendChild(li);
});
