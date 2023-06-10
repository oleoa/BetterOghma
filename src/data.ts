export type Data = {
  subjects: string[];
  ids: Map<string, string>;
  evaluations: Map<string, string>;
};

export function getAvarage(page: ParentNode): number {
  let avarage = 0;
  let sumAll = 0;
  let countAll = 0;
  page.querySelectorAll('tr').forEach((tr) => {
    if (tr.className != 'header') {
      const tds = tr.querySelectorAll('td');
      sumAll += parseInt(tds[2]?.textContent ?? '0', 10);
      countAll++;
    }
  });
  avarage = sumAll / countAll;
  return avarage;
}

export async function getAllSubjectsFromCourse(id: string): Promise<Data> {
  const couseURL = new URL(`https://oghma.epcc.pt/courses/${id}`);
  const data: Data = {
    subjects: [],
    ids: new Map(),
    evaluations: new Map(),
  };

  await fetch(couseURL)
    .then((res) => {
      if (!res.ok) {
        throw new Error(/* TODO */);
      }

      return res;
    })
    .then((res) => res.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const trs = doc.querySelectorAll<HTMLTableRowElement>('tbody > tr');
      trs.forEach((tr) => {
        const td = tr.querySelector('td');

        if (td === null) {
          return;
        }

        const subject = td.querySelector('a');

        if (subject === null) {
          return;
        }

        let subjectTitle = subject.textContent;

        if (subjectTitle === null) {
          return;
        }

        if (subjectTitle.endsWith(' ')) {
          subjectTitle = subjectTitle.trimEnd();
        }

        const subjectId = subject.href.split('/')[4];

        if (subjectId === undefined) {
          return;
        }

        data.ids.set(subjectTitle, subjectId);
        data.subjects.push(subjectTitle);
      });
    });

  return data;
}

export async function getSubjectNyUsername(userName: string, subjects: Data) {
  const newSubjects = subjects;

  for (const i of newSubjects.subjects) {
    const subjectEvaluationsURL = `https://oghma.epcc.pt/units/${newSubjects.ids.get(
      i
    )}/evaluations`;

    await fetch(subjectEvaluationsURL).then(async (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(await html.text(), 'text/html');

      const trs = doc.querySelectorAll<HTMLTableRowElement>('tbody > tr');
      trs.forEach(function (tr) {
        const tds = tr.querySelectorAll('td');
        if (tds.length > 0) {
          const td1 = tds[1]?.textContent;
          const td2 = tds[2]?.textContent;

          if (td1 == undefined || td2 == undefined) {
            return;
          }

          if (
            td1.replace(/\s/g, '').toLowerCase() ===
            userName.replace(/\s/g, '').toLowerCase()
          ) {
            const evaluation = td2.split(' ')[0];

            if (typeof evaluation === 'string') {
              newSubjects.evaluations.set(i, evaluation);
            }
          }
        }
      });
    });
  }

  return newSubjects;
}
