/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW ---
  const headerRow = ['Hero']; // match example exactly

  // --- IMAGE ROW ---
  // Find prominent image in the hero section (product teaser image)
  let imageElem = null;
  const prodTeaserImg = element.querySelector('.cmp-product-overview-teaser img');
  if (prodTeaserImg) {
    imageElem = prodTeaserImg;
  }
  const imageRow = [imageElem || ''];

  // --- CONTENT ROW ---
  // Collect text content: breadcrumb, h1, subtitle, teaser h2, all non-empty buttons, etc.
  const contentElements = [];

  // 1. Breadcrumb text (as in the screenshot)
  const breadcrumbNav = element.querySelector('.breadcrumb nav');
  if (breadcrumbNav) {
    const spans = breadcrumbNav.querySelectorAll('span[itemprop="name"]');
    if (spans.length) {
      const breadcrumbDiv = document.createElement('div');
      breadcrumbDiv.style.marginBottom = '0.5em';
      // Build breadcrumb text with separator
      let breadcrumbText = '';
      spans.forEach((span, idx) => {
        breadcrumbText += span.textContent;
        if (idx < spans.length - 1) breadcrumbText += ' / ';
      });
      breadcrumbDiv.textContent = breadcrumbText;
      contentElements.push(breadcrumbDiv);
    }
  }

  // 2. Main title (h1)
  const titleDiv = element.querySelector('.cmp-title h1');
  if (titleDiv) {
    contentElements.push(titleDiv);
  }

  // 3. Subtitle (if present)
  const subtitleDiv = element.querySelector('.subtitle');
  if (subtitleDiv && subtitleDiv.textContent.trim().length) {
    const subtitle = document.createElement('div');
    subtitle.textContent = subtitleDiv.textContent.trim();
    contentElements.push(subtitle);
  }

  // 4. Product Teaser Title (h2)
  const teaserTitle = element.querySelector('.cmp-product-overview-teaser h2');
  if (teaserTitle) {
    contentElements.push(teaserTitle);
  }

  // 5. All non-empty buttons (e.g. CTA)
  const nonEmptyButtons = element.querySelectorAll('button');
  nonEmptyButtons.forEach(btn => {
    if (btn.textContent.trim().length) {
      contentElements.push(btn);
    }
  });

  // 6. Any additional paragraph or description in teaser
  const teaserDesc = element.querySelector('.cmp-product-overview-teaser p');
  if (teaserDesc) {
    contentElements.push(teaserDesc);
  }

  // If no content found, fallback to all text
  if (contentElements.length === 0) {
    const fallbackText = element.textContent.trim();
    if (fallbackText) {
      contentElements.push(document.createTextNode(fallbackText));
    }
  }

  // Row: array of elements (or '' if none)
  const contentRow = [contentElements.length ? contentElements : ''];

  // --- CREATE TABLE ---
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // --- REPLACE ---
  element.replaceWith(block);
}
