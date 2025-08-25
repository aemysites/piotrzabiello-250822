/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards60) header
  const headerRow = ['Cards (cards60)'];
  const rows = [];

  // Helper: extract all text content as a block from imagetextblock cards
  function extractImageTextBlock(block) {
    // Get image element (only first image per card)
    let image = block.querySelector('img');
    // Compose all text content (title, description(s), CTA)
    const textContent = [];
    const content = block.querySelector('.cmp-teaser__content');
    if (content) {
      // Title handling (preserve semantic, use <strong> for cards)
      const title = content.querySelector('.cmp-teaser__title');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textContent.push(strong);
      }
      // Description(s) - handle multiple paragraphs, HTML elements
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) {
        Array.from(desc.childNodes).forEach(node => {
          // Include paragraphs, spans, text nodes (avoid empty text)
          if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
            textContent.push(node);
          }
        });
      }
      // CTA (call-to-action)
      const cta = content.querySelector('.cmp-teaser__action-link');
      if (cta) {
        textContent.push(cta);
      }
    }
    // If nothing extracted, fallback: get all <h3>, <p>, <a> children
    if (textContent.length === 0) {
      Array.from(block.querySelectorAll('h3, p, a')).forEach(el => {
        textContent.push(el);
      });
    }
    // Always return a row: [image, ...text]
    return [image || '', textContent.length === 1 ? textContent[0] : textContent];
  }

  // Helper for .teaser (no image)
  function extractTeaserBlock(teaser) {
    const textContent = [];
    const content = teaser.querySelector('.cmp-teaser__content');
    if (content) {
      // Title
      const title = content.querySelector('.cmp-teaser__title');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textContent.push(strong);
      }
      // CTA
      const cta = content.querySelector('.cmp-teaser__action-link');
      if (cta) {
        textContent.push(cta);
      }
    }
    // Fallback: all <h3>, <p>, <a>
    if (textContent.length === 0) {
      Array.from(teaser.querySelectorAll('h3, p, a')).forEach(el => {
        textContent.push(el);
      });
    }
    return ['', textContent.length === 1 ? textContent[0] : textContent];
  }

  // Find all imagetextblock cards
  const cardBlocks = Array.from(element.querySelectorAll('.imagetextblock.teaser'));
  cardBlocks.forEach(block => {
    rows.push(extractImageTextBlock(block));
  });

  // Find teaser-only cards (no image)
  const cardsContainer = element.querySelector('.cmp-container_cards');
  if (cardsContainer) {
    const teasers = Array.from(cardsContainer.querySelectorAll(':scope > .teaser'));
    teasers.forEach(teaser => {
      rows.push(extractTeaserBlock(teaser));
    });
  }

  // Compose the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
