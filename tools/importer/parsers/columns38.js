/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children of the main container
  const topLevelDivs = element.querySelectorAll(':scope > div');

  let mainNavList = null;
  let socialContainer = null;
  let legalList = null;

  topLevelDivs.forEach((div) => {
    if (div.classList.contains('cmp-faq_list')) {
      mainNavList = div.querySelector('ul');
    } else if (div.classList.contains('cmp-social_container')) {
      socialContainer = div;
    } else if (div.classList.contains('cmp-menu_list')) {
      legalList = div.querySelector('ul');
    }
  });

  // Fallbacks if any are missing
  if (!mainNavList || !socialContainer || !legalList) {
    const uls = element.querySelectorAll('ul');
    if (!mainNavList && uls[0]) mainNavList = uls[0];
    if (!legalList && uls[1]) legalList = uls[1];
    if (!socialContainer) {
      socialContainer = Array.from(element.querySelectorAll('div')).find(div =>
        div.className && div.className.includes('social')
      );
    }
  }

  // Social buttons: only direct children with class 'button'
  let socialButtons = [];
  if (socialContainer) {
    socialButtons = Array.from(socialContainer.querySelectorAll(':scope > .button'));
  }

  // Compose the table rows
  const headerRow = ['Columns (columns38)'];
  // First row: nav list and social buttons side by side
  const firstRow = [mainNavList, socialButtons];
  // Second row: ONLY legal links, as a single column (no empty columns)
  const secondRow = [legalList];

  const tableRows = [
    headerRow,
    firstRow,
    secondRow,
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
