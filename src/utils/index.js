import MarkDown from '@/components/MarkDown.vue';
import NotePad from '@/components/NotePad.vue';
import { useDrive, useProgram } from '@/store';
import axios from 'axios';
import dayjs from 'dayjs';
import { onMounted } from 'vue';

export function sortAlphabetically(propA, propB) {
  const a = propA.toLowerCase();
  const b = propB.toLowerCase();

  if (a > b) return 1;
  if (a < b) return -1;
  if (a === b) return 0;
}

export async function loadFileFromGDrive(item) {
  const apiKey = process.env.VUE_APP_API_KEY;

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${item.id}?key=${apiKey}&alt=media`
  );

  const contents = await response.text();
  return contents;
}

// export async function loadFile() {
//   const response = await axios({
//     url: `https://api.github.com/repos/yj520435/yj520435.github.io/contents/${path}`,
//     method: 'get',
//   });
// }

const fileIconMap = new Map()
  .set('text/markdown', 'file.svg')
  .set('text/x-markdown', 'file.svg');

const fileComponentMap = new Map()
  .set('text/markdown', MarkDown)
  .set('text/x-markdown', MarkDown);

// const fileIconMap = new Map().set('md', 'file.svg');

// const fileComponentMap = new Map().set('md', MarkDown);

const url =
  'macros/s/AKfycbxPzcuBRiXuT_-7_m5JRmFjmjoGw0-wJLTWDG-LF0IiIosC1ihnOEic04ei_i5j6KcG/exec';

export async function createFile(id, name, content) {
  axios({
    url,
    method: 'post',
    params: {
      id,
      command: 'create',
      name,
      content,
      mimeType: 'text/x-markdown',
    },
  })
    .then((v) => {
      console.log('성공', v);
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function updateFile(fileId, content) {
  axios({
    url,
    method: 'post',
    params: {
      id: fileId,
      content,
    },
  })
    .then((v) => {
      console.log('성공', v);
    })
    .catch((error) => {
      console.error('실패', error);
    });
}

export async function deleteFile(id) {
  axios({
    url,
    method: 'post',
    params: {
      id,
      command: 'delete',
    },
  })
    .then((v) => {
      console.log('성공', v);
    })
    .catch((error) => {
      console.error('실패', error);
    });
}

export async function loadFile(file) {
  const response = await axios({
    url,
    method: 'get',
    params: {
      fileId: file.id,
      command: 'contents',
      mimeType: 'text/x-markdown',
    },
  });
  console.log('>> loadFile', response);
  return response.data;
  // const response = await axios({
  //   url: `https://api.github.com/repos/yj520435/yj520435.github.io/contents/${item.id}`,
  //   method: 'get',
  // });
  // console.log(response);
  // return response;
}

export async function loadDirHierarchy(path, depth) {
  const result = [];

  const response = await axios({
    url: `https://api.github.com/repos/yj520435/yj520435.github.io/contents/${path}`,
    method: 'get',
  });
  const items = response.data;

  const folders = items.filter((v) => v.type === 'dir');

  for (const folder of folders) {
    // const li = document.createElement('li');
    // const span = document.createElement('span');
    // span.textContent = folder.name;
    // li.appendChild(span);

    result.push({ ...folder, depth });

    const subfolders = await loadDirHierarchy(folder.path, depth + 1);

    if (subfolders.length > 0) {
      for (const subfolder of subfolders) {
        result.push({ ...subfolder, depth: depth + 1 });
      }
    }
  }

  return result;
}

export async function loadDirFromGithub(path) {
  const result = [];

  const response = await axios({
    url: `https://api.github.com/repos/yj520435/yj520435.github.io/contents/${path}`,
    method: 'get',
  });

  console.log('# ', response);
  const items = response.data;

  const folders = items.filter((v) => v.type === 'dir');
  const files = items.filter((v) => v.type === 'file');

  for (const folder of folders) {
    result.push({
      id: folder.id,
      name: folder.name,
      icon: 'folder.svg',
      component: null,
    });
  }

  for (const file of files) {
    const extension = file.name.split('.')[1];
    result.push({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      icon: fileIconMap.get(extension),
      component: fileComponentMap.get(extension),
    });
  }

  return result;
}

export async function initDir() {
  const loadedResult = localStorage.getItem('archive');
  if (loadedResult) {
    return JSON.parse(loadedResult);
  } else {
    const result = await loadDir(null, 0);
    localStorage.setItem('archive', JSON.stringify(result));
    return result;
  }
}

export function resetDir() {
  localStorage.removeItem('archive');
}

export async function loadDir(id, depth) {
  const result = [];

  const response = await axios({
    url,
    method: 'get',
    params: {
      dirId: id,
      command: 'list',
    },
  });

  const folders = response.data.result.filter((v) => v.type === 'dir');
  const files = response.data.result.filter((v) => v.type === 'file');

  for (const folder of folders) {
    const items = await loadDir(folder.id, depth + 1);
    result.push({
      id: folder.id,
      name: folder.name,
      type: 'dir',
      // icon: 'folder.svg',
      // component: null,
      items,
      depth,
    });
  }

  for (const file of files) {
    result.push({
      id: file.id,
      name: file.name,
      type: 'file',
      mimeType: file.mimeType,
      depth,
      // icon: fileIconMap.get(file.mimeType),
      // component: fileComponentMap.get(file.mimeType),
    });
  }

  // localStorage.setItem('archive', JSON.stringify(result));

  console.log('#', result);
  return result;

  // const q = `'${dirId}'+in+parents`;
  // const response = await fetch(
  //   `https://www.googleapis.com/drive/v3/files?q=${q}&key=${apiKey}`
  // );

  // const items = (await response.json()).files;

  // const folderMimeType = 'application/vnd.google-apps.folder';
  // const folders = items.filter((v) => v.mimeType === folderMimeType);
  // const files = items.filter((v) => v.mimeType !== folderMimeType);

  // for (const folder of folders) {
  //   result.push({
  //     id: folder.id,
  //     name: folder.name,
  //     icon: 'folder.svg',
  //     component: null,
  //   });
  // }

  // for (const file of files) {
  //   result.push({
  //     id: file.id,
  //     name: file.name,
  //     icon: fileIconMap.get(file.mimeType),
  //     component: fileComponentMap.get(file.mimeType),
  //   });
  // }

  // return result;
}

export async function loadDirFromLocal(path) {
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
      // result.push(loadFile(name, extension, convertedDate));
    }
  }
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
