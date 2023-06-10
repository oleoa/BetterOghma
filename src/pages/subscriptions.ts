import { checkItem } from '../storage';
import { flex, getAll, getByClass, hide } from '../utils';
import { AVARAGE_DECIMAL_PARTS } from '../conf';
import { getAvarage } from '../data';

export default function () {
  getByClass('student active', function (element) {
    element.querySelectorAll('a').forEach(function (a) {
      a.href += '/evaluations';
    });
  });

  getAll('.student:not(.active)', hide);

  getByClass('users-list photo', flex);

  getByClass('users-list photo', function (element) {
    element.style.flexWrap = 'wrap';
  });

  let avarageSum = 0;
  let totalStudents = 0;
  getByClass('student active', async function (element) {
    const id = element.querySelector('a')?.href.split('/')[4];

    const evaluationsURL = `https://oghma.epcc.pt/users/${id}/evaluations`;

    if (id) {
      await fetch(evaluationsURL).then(async (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(await html.text(), 'text/html');
        const avarage = getAvarage(doc);
        avarageSum += avarage;
        totalStudents++;
        element.style.order =
          (checkItem('DECREASE', 'true') ? '-' : '') +
          (avarage * 1000).toFixed(0);
        const averageElement = document.createElement('p');
        averageElement.textContent =
          'Média de ' + avarage.toFixed(AVARAGE_DECIMAL_PARTS) + ' pontos';
        element.appendChild(averageElement);
      });
    } else {
      const totalAvarage = avarageSum / totalStudents;
      const p = element.querySelector('p');

      if (p === null) {
        return;
      }

      p.textContent = `Média de ${totalAvarage.toFixed(
        AVARAGE_DECIMAL_PARTS
      )} pontos`;
      element.style.order =
        (checkItem('DECREASE', 'true') ? '-' : '') +
        (totalAvarage * 1000).toFixed(0);
    }
  });

  getByClass('users-list photo', function (element) {
    const avarageStudent = document.createElement('li');
    const imageA = document.createElement('a');
    const image = document.createElement('img');
    const br = document.createElement('br');
    const span = document.createElement('span');
    const a = document.createElement('a');
    const p = document.createElement('p');

    avarageStudent.className = 'student active';
    image.src =
      'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';
    image.style.height = '79px';
    image.style.width = 'auto';
    span.textContent = 'Média';
    a.textContent = 'Aluno Médio';

    imageA.appendChild(image);
    avarageStudent.appendChild(imageA);
    avarageStudent.appendChild(span);
    avarageStudent.appendChild(br);
    avarageStudent.appendChild(a);
    avarageStudent.appendChild(p);
    element.appendChild(avarageStudent);
  });
}
