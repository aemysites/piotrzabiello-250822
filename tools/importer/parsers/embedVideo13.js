/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per example
  const headerRow = ['Embed (embedVideo13)'];

  // Collect for cell: poster image, link, text content
  const cellContents = [];

  // Poster image extraction
  let posterUrl = '';
  const videoEl = element.querySelector('video[poster]');
  if (videoEl && videoEl.getAttribute('poster')) {
    posterUrl = videoEl.getAttribute('poster');
  } else {
    const divPoster = element.querySelector('div[poster]');
    if (divPoster && divPoster.getAttribute('poster')) {
      posterUrl = divPoster.getAttribute('poster');
    }
  }
  if (posterUrl) {
    const img = document.createElement('img');
    img.src = posterUrl;
    img.alt = '';
    cellContents.push(img);
  }

  // Video/link extraction (Scene7 logic)
  let videoUrl = '';
  const s7Div = element.querySelector('[data-videoserver]');
  if (s7Div) {
    const assetName = s7Div.getAttribute('data-asset-name');
    const assetPath = s7Div.getAttribute('data-asset-path');
    const server = s7Div.getAttribute('data-videoserver');
    if (server && assetName) {
      videoUrl = server + assetName;
    } else if (server && assetPath) {
      videoUrl = server + assetPath;
    }
  }
  // Fallback to non-blob video src
  if (!videoUrl) {
    const vid = element.querySelector('video');
    if (vid && vid.getAttribute('src') && !vid.getAttribute('src').startsWith('blob:')) {
      videoUrl = vid.getAttribute('src');
    }
  }
  if (videoUrl) {
    if (cellContents.length) cellContents.push(document.createElement('br'));
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoUrl;
    a.target = '_blank';
    a.rel = 'noopener';
    cellContents.push(a);
  }

  // Grab all visible text, excluding overlays/dialogs/controls
  function extractVisibleText(el) {
    let text = '';
    if (el.nodeType === Node.TEXT_NODE) {
      if (el.textContent.trim()) text += el.textContent.trim() + '\n';
    } else if (el.nodeType === Node.ELEMENT_NODE) {
      // Ignore overlays, dialogs, controls commonly unrelated to user content
      const skipClasses = [
        's7controlbar', 's7emaildialog', 's7embeddialog', 's7linkdialog',
        's7socialshare', 's7iconeffect', 's7waiticon', 's7mutablevolume',
        's7audiocaptions', 's7videoplayer', 's7container', 's7innercontainer'
      ];
      for (const cls of skipClasses) {
        if (el.classList && el.classList.contains(cls)) return text;
      }
      // Traverse children
      for (const child of el.childNodes) {
        text += extractVisibleText(child);
      }
    }
    return text;
  }
  const textContent = extractVisibleText(element).trim();
  if (textContent) {
    const p = document.createElement('p');
    p.textContent = textContent;
    cellContents.push(p);
  }

  // Fallback for empty cell
  if (cellContents.length === 0) {
    cellContents.push('');
  }

  // Compose rows: header then single-content cell
  const rows = [headerRow, [cellContents]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
