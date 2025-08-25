/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must match example exactly
  const headerRow = ['Columns (columns21)'];
  const cells = [headerRow];

  // --- Row 1: Main Hero (text/image) and Facts/Stats ---
  // Left: first cmp-image-text-block
  // Right: factsfigurescontainer (3 stats)
  const heroTeaser = element.querySelector('.cmp-image-text-block');
  const factsContainer = element.querySelector('.factsfigurescontainer');
  let statsDiv = null;
  if (factsContainer) {
    // Collect all stat .cmp-text as children into a div
    statsDiv = document.createElement('div');
    Array.from(factsContainer.querySelectorAll('.cmp-text')).forEach(t => statsDiv.appendChild(t));
  }
  if (heroTeaser && statsDiv) {
    cells.push([heroTeaser, statsDiv]);
  }

  // --- Row 2: Next cmp-image-text-block, and right column with all content up to next container ---
  // Find all .cmp-image-text-block instances
  const allTeasers = Array.from(element.querySelectorAll('.cmp-image-text-block'));
  if (allTeasers.length > 1) {
    const secondTeaser = allTeasers[1];
    // Right col: everything after this teaser up to the next .container or .cmp-container-section-heading__dark-blue
    const rightCol = [];
    let next = secondTeaser.parentElement.nextElementSibling;
    while (next &&
      !next.classList.contains('container') &&
      !next.classList.contains('cmp-container-section-heading__dark-blue')) {
      // Only add non-empty and meaningful elements
      if (
        next.matches('.text, .button, .separator, .title, .dynamicmedia') &&
        (next.textContent.trim() || next.querySelector('img,a,video'))
      ) {
        rightCol.push(next);
      }
      next = next.nextElementSibling;
    }
    if (rightCol.length > 0) {
      cells.push([secondTeaser, rightCol]);
    }
  }

  // --- Row 3: Blue Principle Columns Section ---
  const blueSection = element.querySelector('.cmp-container-section-heading__dark-blue');
  if (blueSection) {
    const blueGrid = blueSection.querySelector('.aem-Grid');
    if (blueGrid) {
      // Left: the title and first two text blocks
      const leftCol = [];
      const blueTitle = blueGrid.querySelector('.title');
      if (blueTitle) leftCol.push(blueTitle);
      const blueTexts = Array.from(blueGrid.querySelectorAll('.text'));
      if (blueTexts.length > 0) leftCol.push(blueTexts[0]); // Woran wir glauben
      if (blueTexts.length > 1) leftCol.push(blueTexts[1]); // Die Fresenius Prinzipien
      // Right: All subsequent .text blocks (principle columns)
      const principleCols = blueTexts.slice(2);
      if (leftCol.length && principleCols.length) {
        cells.push([leftCol, principleCols]);
      }
    }
  }

  // --- Row 4: Quote + Video ---
  // Find quote .title with matching h3 text and its dynamicmedia sib
  const allTitles = Array.from(element.querySelectorAll('.title'));
  const quoteTitle = allTitles.find(el => el.textContent.includes('mehr als das'));
  if (quoteTitle) {
    let videoBlock = quoteTitle.nextElementSibling;
    while (videoBlock && !videoBlock.classList.contains('dynamicmedia')) {
      videoBlock = videoBlock.nextElementSibling;
    }
    if (videoBlock) {
      cells.push([quoteTitle, videoBlock]);
    }
  }

  // --- Row 5: Investor Note ---
  const investorNote = Array.from(element.querySelectorAll('.text')).find(el => el.textContent.includes('Daten aus 2024 Investor News'));
  if (investorNote) {
    cells.push([investorNote]);
  }

  // --- Output ---
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
