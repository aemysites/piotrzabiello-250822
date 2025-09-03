/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the first list (cmp-faq_list)
  const firstList = element.querySelector('.cmp-faq_list');

  // 2. Find the social icons container (cmp-social_container)
  const socialContainer = element.querySelector('.cmp-social_container');
  let socialIcons = null;
  if (socialContainer) {
    // Get all direct .button children (social icons)
    const socialButtons = Array.from(socialContainer.querySelectorAll('.button'));
    if (socialButtons.length) {
      // Wrap all social buttons in a div for layout
      const socialDiv = document.createElement('div');
      socialDiv.style.display = 'flex';
      socialDiv.style.gap = '16px';
      socialButtons.forEach(btn => socialDiv.appendChild(btn));
      socialIcons = socialDiv;
    }
  }

  // 3. Find the second list (cmp-menu_list)
  const secondList = element.querySelector('.cmp-menu_list');

  // Build the columns row (always 3 columns for this layout)
  const columnsRow = [firstList, socialIcons, secondList];

  // Table header (must match block name exactly)
  const headerRow = ['Columns (columns38)'];

  // Table cells
  const cells = [
    headerRow,
    columnsRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
