/* global WebImporter */
export default function parse(element, { document }) {
  // Find all top-level .cmp-container blocks which form the two columns
  const containers = Array.from(element.querySelectorAll(':scope > div > .cmp-container'));

  let leftCol = null;
  let rightColItems = [];

  if (containers.length === 2) {
    // Left column: FAQ list ul
    leftCol = containers[0].querySelector('.cmp-faq_list .cmp-list') || containers[0].querySelector('.cmp-list');

    // Right column: social icons & menu list
    // Social block
    const socialBlock = containers[1].querySelector('.cmp-social_container .cmp-container') || containers[1].querySelector('.cmp-container');
    const socialButtons = socialBlock ? Array.from(socialBlock.querySelectorAll('.button a')) : [];
    // Footer menu list
    const menuList = containers[1].querySelector('.cmp-menu_list .cmp-list') || containers[1].querySelector('.cmp-list');
    if (socialButtons.length) rightColItems.push(...socialButtons);
    if (menuList) rightColItems.push(menuList);
  } else {
    // fallback for unexpected structure
    leftCol = element.querySelector('.cmp-faq_list .cmp-list') || element.querySelector('.cmp-list');
    const socialBlock = element.querySelector('.cmp-social_container .cmp-container') || element.querySelector('.cmp-container');
    const socialButtons = socialBlock ? Array.from(socialBlock.querySelectorAll('.button a')) : [];
    const menuList = element.querySelector('.cmp-menu_list .cmp-list') || element.querySelector('.cmp-list');
    if (socialButtons.length) rightColItems.push(...socialButtons);
    if (menuList) rightColItems.push(menuList);
  }
  // Edge case handling
  if (!leftCol) leftCol = document.createElement('div');
  if (rightColItems.length === 0) rightColItems = [document.createElement('div')];

  // Table rows: header row (single cell), content row (two columns)
  const cells = [
    ['Columns (columns38)'],
    [leftCol, rightColItems]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
