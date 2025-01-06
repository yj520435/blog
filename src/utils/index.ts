import { API_KEY, API_URL, JSON } from '@/constants';
import axios from 'axios';

export function sortAlphabetically(pa: string, pb: string) {
  const a = pa.toLowerCase();
  const b = pb.toLowerCase();

  if (a > b) return 1;
  if (a < b) return -1;
  if (a === b) return 0;
}

export async function loadFolder(id: string) {
  const url = `https://www.googleapis.com/drive/v3/files?q="${id}"+in+parents&key=${API_KEY}`;
  try {
    const response = await fetch(url);
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
    const response = await fetch(url);
    if (response.ok) {
      const data = type === JSON ? response.json() : response.text();
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
