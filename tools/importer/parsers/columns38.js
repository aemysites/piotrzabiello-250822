/* global WebImporter */
export default function parse(element, { document }) {
  // Extract left column: FAQ list
  const faqList = element.querySelector('.cmp-faq_list ul');
  let leftCol;
  if (faqList) {
    leftCol = document.createElement('div');
    Array.from(faqList.children).forEach(li => {
      const a = li.querySelector('a');
      if (a) {
        const link = document.createElement('a');
        link.href = a.href;
        link.textContent = a.textContent.trim();
        link.style.display = 'block';
        leftCol.appendChild(link);
      }
    });
  } else {
    leftCol = document.createElement('div');
  }

  // Extract middle column: Social icons
  const socialContainer = element.querySelector('.cmp-social_container');
  let middleCol;
  if (socialContainer) {
    middleCol = document.createElement('div');
    const buttons = socialContainer.querySelectorAll('.cmp-button');
    buttons.forEach(btn => {
      const a = document.createElement('a');
      a.href = btn.href;
      a.target = '_blank';
      // Find icon class
      const iconSpan = btn.querySelector('span');
      if (iconSpan) {
        const icon = document.createElement('span');
        icon.className = iconSpan.className;
        icon.setAttribute('aria-hidden', 'true');
        a.appendChild(icon);
      }
      middleCol.appendChild(a);
    });
  } else {
    middleCol = document.createElement('div');
  }

  // Extract right column: Menu list
  const menuList = element.querySelector('.cmp-menu_list ul');
  let rightCol;
  if (menuList) {
    rightCol = document.createElement('div');
    Array.from(menuList.children).forEach(li => {
      const a = li.querySelector('a');
      if (a) {
        const link = document.createElement('a');
        link.href = a.href;
        link.textContent = a.textContent.trim();
        link.style.marginRight = '2em';
        rightCol.appendChild(link);
      }
    });
  } else {
    rightCol = document.createElement('div');
  }

  // Table header
  const headerRow = ['Columns (columns38)'];
  // Compose table data
  const cells = [headerRow, [leftCol, middleCol, rightCol]];
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
