import { nextTick } from 'vue';

export async function highlightCode() {
  await nextTick();
  const elements = document.getElementsByClassName('html');
  for (const el of elements) {
    console.log(el.innerHTML);
    // const originalHtmls = el.innerHTML.split('\n');
    // .replaceAll('&lt;', '<').replaceAll('&gt;', '>');

    // const htmlTags = ['article', 'h1', 'ol', 'li'];

    // console.log(originalHtml.split('\n'));

    // for (const html of originalHtmls) {
    //   const matchedItems = [...html.matchAll(/(&lt;[/]*)+\w+(&gt;)+/g)];
    //   console.log(matchedItems);
    // }

    // const tags = [...originalHtml.matchAll];
    // console.log(tags);

    // for (const tag of tags) {
    //   const string = tag[0];

    //   const t1 = string.includes('&lt;/') ? '&lt;/' : '&lt;';
    //   const t2 = '&gt;';

    //   const convertedT1 = `<span class="html-lt">${t1}</span><span class="html-tag">`;
    //   const convertedT2 = `</span><span class="html-rt">${t2}</span>`;

    //   const convertedString = string.replace(t1, convertedT1).replace(t2, convertedT2);
    //   // el.innerHTML = el.innerHTML.replace(tag[0])
    // }

    // for (const tag of htmlTags) {

    // .replaceAll(
    //   `&lt;${tag}&gt;`,
    //   `<span class="html-lt">&lt;</span>`
    //     .concat(`<span class="html-tag">${tag}</span>`)
    //     .concat(`<span class="html-gt">&gt;</span>`)
    // )
    // .replaceAll(
    //   `&lt;/${tag}&gt;`,
    //   `<span class="html-lt">&lt;/</span>`
    //     .concat(`<span class="html-tag">${tag}</span>`)
    //     .concat(`<span class="html-gt">&gt;</span>`)
    // );
    // }

    // .replaceAll('&lt;', '&lt;<span class="html-tag">')
    // .replaceAll('&gt;', '</span>&gt;')
    // .replaceAll('&lt;', '<span>&lt;</span>')
    // .replaceAll('&gt;', '<span>&gt;</span>');

    // const parser = new DOMParser();
    // const html = parser
    //   .parseFromString(originalHtml, 'text/html')
    //   .getElementsByTagName('body')[0].childNodes[0];

    // console.log('#', html);

    // const lines = el.innerHTML.split('\n');
    // for (const line of lines) {
    //   console.log(line.replaceAll(' ', '').match(/(^&lt;).*(&gt;)/g));
    // }

    // console.log(originalHtml);
    // console.log(originalHtml.match(/.*/g));

    // el.innerHTML = originalHtml
    //   .replaceAll('&lt;', '<span class="">&lt;</span>')
    //   .replaceAll('&gt;', '<span class="">&gt;</span>');
  }
}
