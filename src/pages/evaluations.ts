import { executeSite } from '../sites';
import { checkItem, getItem, setItem } from '../storage';
import { flex, get, getAll, getByClass, grid, hide } from '../utils';
import { AVARAGE_DECIMAL_PARTS } from '../conf';
import {
  type Data,
  getAllSubjectsFromCourse,
  getSubjectNyUsername,
} from '../data';
import { segments as urlArray } from '../url';

export default async function () {
  if (!checkItem('lastUser', urlArray[4])) {
    const itemToKeep = 'decrease';

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key != itemToKeep && key != undefined) {
        localStorage.removeItem(key);
      }
    }

    setItem('lastUser', urlArray[4]);
  }

  get('tbody', grid);
  getAll('tr', grid);

  getAll('tr', function (element) {
    const sons = element.querySelectorAll(
      element.className == 'header' ? 'th' : 'td'
    );
    for (let i = 0; i < sons.length; i++) {
      const son = sons[i];

      if (son === undefined) {
        continue;
      }

      flex(son);
      if (element.className == 'header') {
        element.style.order = '-21';
        if (i == 0) {
          son.style.gridColumn = 'span 2 / span 2';
        }
        if (i > 0) {
          son.style.justifyContent = 'end';
        }
        if (i > 2) {
          hide(son);
        }
      } else {
        if (i > 1) {
          son.style.justifyContent = 'end';
        }
        if (i == 2) {
          element.style.order =
            (checkItem('DECREASE', 'true') ? '-' : '') + son.textContent;
        }
        if (i > 3) {
          hide(son);
        }
      }
    }

    element.style.gridTemplateColumns = '3fr 5fr 1fr 1fr';
  });

  let subjects: Data;
  const coursesURL =
    'https://oghma.epcc.pt/users/' + urlArray[4] + '/subscriptions';
  let courseId = 0;

  await fetch(coursesURL).then(async (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(await html.text(), 'text/html');
    const tr = doc.querySelector<HTMLTableRowElement>('tbody > tr');

    if (tr === null) {
      return;
    }

    const anchor = tr.querySelector<HTMLAnchorElement>('td:nth(2) a');

    if (anchor === null) {
      return;
    }

    const id = anchor.href.split('/')[4];

    if (id === undefined) {
      return;
    }

    courseId = parseInt(id, 10);
  });

  if (!checkItem('allSubjectsSet', 'true')) {
    const userh1 = document
      .getElementsByClassName('well clearfix')[0]
      ?.querySelector('h1');

    if (userh1 == undefined) {
      return;
    }

    const smallElement = userh1.querySelector('small');

    if (smallElement === null) {
      return;
    }

    const smallText = smallElement.textContent;

    if (smallText === null) {
      return;
    }

    const userName = userh1.textContent?.substring(smallText.length);

    if (userName === undefined) {
      return;
    }

    subjects = await getAllSubjectsFromCourse(courseId.toString());
    subjects = await getSubjectNyUsername(userName, subjects);
    for (let i = 0; i < subjects.subjects.length; i++) {
      const title = subjects.subjects[i];

      if (title === undefined) {
        continue;
      }

      setItem(title, getItem(title, subjects.evaluations.get(title)));
      setItem(title + '_isActived', getItem(title + '_isActived', 'true'));
    }
    setItem('allSubjectsSet', 'true');
  } else {
    subjects = await getAllSubjectsFromCourse(courseId.toString());
    subjects.evaluations = new Map();
    subjects.subjects.forEach(function (title) {
      const evaluation = getItem(title, '0');

      if (typeof evaluation === 'string') {
        subjects.evaluations.set(title, evaluation);
      }
    });
  }

  await getByClass('well clearfix', async function (element) {
    let avarageSubjectSum = 0;
    let subjectsCount = 0;

    subjects.subjects.forEach(function (title) {
      if (
        subjects.evaluations.get(title) != '' &&
        checkItem(title + '_isActived', 'true')
      ) {
        subjectsCount++;
        const evaluation = subjects.evaluations.get(title);

        if (evaluation === undefined) {
          return;
        }

        avarageSubjectSum += parseFloat(evaluation);
      }
    });

    const avarage = (avarageSubjectSum / subjectsCount).toFixed(
      AVARAGE_DECIMAL_PARTS
    );

    let averageElement = null;
    if (document.getElementById('alunoAvarageText')) {
      averageElement = document.getElementById('alunoAvarageText');
    } else {
      averageElement = document.createElement('p');
      averageElement.id = 'alunoAvarageText';
    }

    if (averageElement === null) {
      return;
    }

    averageElement.innerText = `O aluno tem uma média de ${avarage} pontos`;

    if (!document.getElementById('alunoAvarageText')) {
      element.appendChild(averageElement);
    }
  });

  getByClass('span2 sidebar', function (element) {
    if (document.getElementById('evaluationsCheckers')) return;
    const div = document.createElement('div');
    div.id = 'evaluationsCheckers';
    div.style.paddingLeft = '0.8rem';
    div.style.paddingRight = '0.8rem';
    element.appendChild(div);
    for (let i = 0; i < subjects.subjects.length; i++) {
      const title = subjects.subjects[i];

      const subjectElementDiv = document.createElement('div');
      subjectElementDiv.style.display = 'flex';
      subjectElementDiv.style.flexDirection = 'row';
      subjectElementDiv.style.alignItems = 'center';
      subjectElementDiv.style.justifyContent = 'start';
      subjectElementDiv.style.padding = '0.25rem';

      const subjectElementCheckbox = document.createElement('input');
      subjectElementCheckbox.type = 'checkbox';
      subjectElementCheckbox.id = title + '_checkbox';
      if (checkItem(title + '_isActived', 'true')) {
        subjectElementCheckbox.checked = true;
      }
      subjectElementCheckbox.onclick = function () {
        setItem(
          title + '_isActived',
          checkItem(title + '_isActived', 'true') ? 'false' : 'true'
        );
        executeSite();
      };

      const subjectElementText = document.createElement('label');
      subjectElementText.style.fontSize = '0.8rem';
      subjectElementText.style.marginBottom = '0rem';
      subjectElementText.style.userSelect = 'none';
      subjectElementText.htmlFor = title + '_checkbox';
      if (typeof title === 'string') {
        subjectElementText.innerText =
          title === 'Tecnologias de Informação e Comunicação' ? 'TIC' : title;
      }
      subjectElementText.style.paddingLeft = '0.5rem';

      const subjectAvarageScore = document.createElement('span');
      if (typeof title === 'string') {
        subjectAvarageScore.innerText =
          subjects.evaluations.get(title) ?? NaN.toString();
      }
      subjectAvarageScore.style.paddingLeft = '0.5rem';

      subjectElementDiv.appendChild(subjectElementCheckbox);
      subjectElementDiv.appendChild(subjectElementText);
      subjectElementDiv.appendChild(subjectAvarageScore);
      div.appendChild(subjectElementDiv);
    }
  });
}
