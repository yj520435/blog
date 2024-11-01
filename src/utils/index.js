import MarkDown from '@/components/MarkDown.vue';
import NotePad from '@/components/NotePad.vue';
import dayjs from 'dayjs';

export async function loadFile(item) {
  const apiKey = process.env.VUE_APP_API_KEY;

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${item.id}?key=${apiKey}&alt=media`
  );

  const contents = await response.text();
  return contents;
}

const fileIconMap = new Map()
  .set('text/markdown', 'file.svg')
  .set('text/x-markdown', 'file.svg');

const fileComponentMap = new Map()
  .set('text/markdown', MarkDown)
  .set('text/x-markdown', MarkDown);

export async function loadDir(id) {
  const result = [];

  const dirId = id ?? process.env.VUE_APP_DIR_ID;
  const apiKey = process.env.VUE_APP_API_KEY;

  const q = `'${dirId}'+in+parents`;
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&key=${apiKey}`
  );

  const items = (await response.json()).files;

  const folderMimeType = 'application/vnd.google-apps.folder';
  const folders = items.filter((v) => v.mimeType === folderMimeType);
  const files = items.filter((v) => v.mimeType !== folderMimeType);

  for (const folder of folders) {
    result.push({
      id: folder.id,
      name: folder.name,
      icon: 'folder.svg',
      component: null,
    });
  }

  for (const file of files) {
    result.push({
      id: file.id,
      name: file.name,
      icon: fileIconMap.get(file.mimeType),
      component: fileComponentMap.get(file.mimeType),
    });
  }

  // const response = await fetch(path);
  // const text = await response.text();

  // const parser = new DOMParser();
  // const dom = parser.parseFromString(text, 'text/html');

  // const files = dom.getElementById('files');

  // for (const file of files.children) {
  //   let object = {};
  //   ['name', 'size', 'date'].forEach((v) => {
  //     object[v] = file.getElementsByClassName(v)[0].innerHTML;
  //   });

  //   if (object.name === '..') continue;

  //   if (object.size === '') {
  //     result.push({
  //       id: object.name,
  //       name: object.name,
  //       icon: 'folder.svg',
  //       component: null,
  //     });
  //   } else {
  //     const name = object.name;
  //     const extension = object.name.split('.')[1];
  //     const date = object.date.includes('오전')
  //       ? object.date.replace('오전', '').concat(' AM')
  //       : object.date.replace('오후', '').concat(' PM');
  //     const convertedDate = dayjs(date, 'YYYY. M. DD. h:mm:ss A', true).unix();
  //     result.push(loadFile(name, extension, convertedDate));
  //   }

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
