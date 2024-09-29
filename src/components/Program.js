import NotePad from './NotePad.vue';

export class Folder {
  constructor(name) {
    this.self = {
      id: name,
      name: name,
      icon: 'directory_open_file_mydocs_2k-4.png',
      items: [],
      component: null,
    };
  }
}

export class NotePadFile {
  constructor(name, date) {
    this.self = {
      id: `notepad-${date}`,
      name: name,
      icon: 'notepad_file-2.png',
      items: [],
      component: NotePad,
    };
  }
}

export function getFile(name, extension, date) {
  if (['md', 'txt'].includes(extension)) {
    return new NotePadFile(name, date).self;
  }
}

// 396m     5,000    12.6원
// 2700m    47,520   17.6원
