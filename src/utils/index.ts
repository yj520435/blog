import { API_KEY, API_URL, FOLDER_MIME_TYPE } from '@/constants';
import { File, MimeType } from '@/types';
import axios from 'axios';

export function getIcon(mimeType: MimeType) {
  switch (mimeType) {
    case 'text/x-markdown':
      return 'file';
    case 'application/vnd.google-apps.folder':
      return 'folder';
    default:
      return 'unknown';
  }
}

export function filterAndSort(data: File[]) {
  // Filter
  const filteredDirectories = data.filter((v: File) => v.mimeType === FOLDER_MIME_TYPE);
  const filteredFiles = data.filter((v: File) => v.mimeType !== FOLDER_MIME_TYPE);

  // Sort
  const sortedDirectories = [...filteredDirectories].sort((a: File, b: File) =>
    sortAlphabetically(a.name, b.name)
  );

  // files.value = sortedDirectories;
  const sortedFiles = [...filteredFiles].sort((a: File, b: File) =>
    sortAlphabetically(a.name, b.name)
  );

  return sortedDirectories.concat(sortedFiles);
}

export function sortAlphabetically(pa: string, pb: string) {
  const a = pa.toLowerCase();
  const b = pb.toLowerCase();

  if (a > b) return 1;
  else if (a < b) return -1;
  else return 0;
}

async function fetchWithTimeout(url: string, options: any = {}) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}

export async function loadFolder(id: string) {
  const url = `https://www.googleapis.com/drive/v3/files?q="${id}"+in+parents&key=${API_KEY}`;
  try {
    const response = await fetchWithTimeout(url, { timeout: 2000 });
    if (response.ok) {
      const data = (await response.json()).files;
      return data;
    } else {
      const data = await reloadFolder(id);
      return data;
    }
  } catch (e) {
    console.error(e);
    const data = await reloadFolder(id);
    return data;
  }
}

export async function loadFile(id: string, type?: string) {
  const url = `https://www.googleapis.com/drive/v3/files/${id}?key=${API_KEY}&alt=media`;
  try {
    const response = await fetchWithTimeout(url, {
      timeout: 2000,
    });
    if (response.ok) {
      const data = type === 'json' ? response.json() : response.text();
      return data;
    } else {
      const data = await reloadFile(id);
      return data;
    }
  } catch (e) {
    console.error(e);
    const data = await reloadFile(id);
    return data;
  }
}

async function reloadFolder(id: string) {
  try {
    const response = await axios({
      url: API_URL,
      method: 'get',
      params: {
        dirId: id,
        command: 'list',
      },
    });
    return response.data?.result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function reloadFile(id: string) {
  try {
    const response = await axios({
      url: API_URL,
      method: 'get',
      params: {
        fileId: id,
        command: 'select',
        mimeType: 'text/x-markdown',
      },
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return [];
  }
}
