/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all card blocks (image-text pairs)
  function getImageTextBlocks(root) {
    return Array.from(root.querySelectorAll('.imagetextblock.teaser, .imagetextblock.teaser.cmp-no-space'));
  }

  // Helper to get all teaser cards in the last container
  function getTeaserCards(root) {
    const cardsContainer = Array.from(root.querySelectorAll('.cmp-container_cards')).pop();
    if (!cardsContainer) return [];
    return Array.from(cardsContainer.querySelectorAll('.teaser'));
  }

  // Compose the header row
  const headerRow = ['Cards (cards60)'];
  const rows = [];

  // 1. Parse image-text blocks (main cards)
  const imageTextBlocks = getImageTextBlocks(element);
  imageTextBlocks.forEach(block => {
    // Find image
    const imageWrap = block.querySelector('.cmp-teaser__image');
    let imgEl = null;
    if (imageWrap) {
      imgEl = imageWrap.querySelector('img');
    }
    // Find text content
    const contentWrap = block.querySelector('.cmp-teaser__content');
    const textCell = document.createElement('div');
    if (contentWrap) {
      // Title
      const title = contentWrap.querySelector('.cmp-teaser__title');
      if (title) {
        textCell.appendChild(title.cloneNode(true));
      }
      // Description (can have multiple paragraphs)
      const desc = contentWrap.querySelector('.cmp-teaser__description');
      if (desc) {
        Array.from(desc.childNodes).forEach(node => {
          textCell.appendChild(node.cloneNode(true));
        });
      }
      // CTA
      const cta = contentWrap.querySelector('.cmp-teaser__action-container a');
      if (cta) {
        textCell.appendChild(cta.cloneNode(true));
      }
    }
    // Only add if image and text exist
    if (imgEl && textCell.childNodes.length) {
      rows.push([imgEl, textCell]);
    }
  });

  // 2. Parse teaser cards (bottom grid)
  const teaserCards = getTeaserCards(element);
  teaserCards.forEach(teaser => {
    const content = teaser.querySelector('.cmp-teaser__content');
    if (!content) return;
    let imgCell = '';
    const textCell = document.createElement('div');
    // Title (as heading link)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      textCell.appendChild(title.cloneNode(true));
    }
    // CTA
    const cta = content.querySelector('.cmp-teaser__action-container a');
    if (cta) {
      textCell.appendChild(cta.cloneNode(true));
    }
    if (textCell.childNodes.length) {
      rows.push([imgCell, textCell]);
    }
  });

  // Build table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
