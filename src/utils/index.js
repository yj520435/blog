import NotePad from '@/components/NotePad.vue';
import dayjs from 'dayjs';

function loadFile(name, extension, id) {
  let icon = '';
  let component = null;

  if (['md', 'txt'].includes(extension)) {
    icon = 'file.svg';
    component = NotePad;
  }

  return { id, name, icon, component };
}

export async function loadDir(path) {
  const result = [];

  const response = await fetch(path);
  const text = await response.text();

  const parser = new DOMParser();
  const dom = parser.parseFromString(text, 'text/html');

  const files = dom.getElementById('files');

  for (const file of files.children) {
    let object = {};
    ['name', 'size', 'date'].forEach((v) => {
      object[v] = file.getElementsByClassName(v)[0].innerHTML;
    });

    if (object.name === '..') continue;

    if (object.size === '') {
      result.push({
        id: object.name,
        name: object.name,
        icon: 'folder.svg',
        component: null,
      });
    } else {
      const name = object.name;
      const extension = object.name.split('.')[1];
      const date = object.date.includes('오전')
        ? object.date.replace('오전', '').concat(' AM')
        : object.date.replace('오후', '').concat(' PM');
      const convertedDate = dayjs(date, 'YYYY. M. DD. h:mm:ss A', true).unix();
      result.push(loadFile(name, extension, convertedDate));
    }
  }

  return result;
}

export function createButton(name, func, style) {
  const button = document.createElement('button');

  button.onclick = func;
  button.innerText = name;

  button.onmousedown = () => (button.classList = 'inset');
  button.onmouseup = () => (button.classList = 'outset');
  button.onmouseout = () => (button.classList = 'outset');

  return button;
}
