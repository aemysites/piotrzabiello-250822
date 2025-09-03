/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all card blocks
  function getCardsFromImagetextblocks(root) {
    const cards = [];
    const blocks = Array.from(root.querySelectorAll('.imagetextblock.teaser'));
    blocks.forEach(block => {
      // Image: find .cmp-teaser__image img
      const imageWrap = block.querySelector('.cmp-teaser__image');
      let img = null;
      if (imageWrap) {
        img = imageWrap.querySelector('img');
      }
      // Text: title, description, CTA
      const content = block.querySelector('.cmp-teaser__content');
      // Instead of picking only title/desc/cta, grab all content children except the image
      const textCell = [];
      if (content) {
        // Get all children except .cmp-teaser__image and .cmp-teaser__caption
        Array.from(content.children).forEach(child => {
          if (!child.classList.contains('cmp-teaser__image') && !child.classList.contains('cmp-teaser__caption')) {
            textCell.push(child.cloneNode(true));
          }
        });
      }
      cards.push([
        img ? img.cloneNode(true) : '',
        textCell.length === 1 ? textCell[0] : textCell
      ]);
    });
    return cards;
  }

  // Helper to extract cards from teaser blocks (bottom grid)
  function getCardsFromTeasers(root) {
    const cards = [];
    const teasers = Array.from(root.querySelectorAll('.teaser'));
    teasers.forEach(teaser => {
      // No image, so use variant: no images
      const content = teaser.querySelector('.cmp-teaser__content');
      const textCell = [];
      if (content) {
        Array.from(content.children).forEach(child => {
          textCell.push(child.cloneNode(true));
        });
      }
      cards.push([
        '', // No image
        textCell.length === 1 ? textCell[0] : textCell
      ]);
    });
    return cards;
  }

  // Find the main cards container
  let cardsContainer = element.querySelector('.cmp-container_cards');
  if (!cardsContainer) {
    cardsContainer = element;
  }

  // Compose header
  const headerRow = ['Cards (cards60)'];
  const rows = [headerRow];

  // Add main image-text cards (top section)
  rows.push(...getCardsFromImagetextblocks(element));

  // Add teaser cards (bottom grid)
  rows.push(...getCardsFromTeasers(cardsContainer));

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
