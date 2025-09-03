/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all text content (including links) from a node
  function extractTextContent(node) {
    const nodes = [];
    // Title (h3 or h2)
    const title = node.querySelector('.cmp-teaser__title');
    if (title) nodes.push(title);
    // Description (all paragraphs)
    const desc = node.querySelector('.cmp-teaser__description');
    if (desc) {
      // Push all paragraphs as separate elements
      desc.querySelectorAll('p').forEach(p => nodes.push(p));
    }
    // CTA (action link)
    const cta = node.querySelector('.cmp-teaser__action-container a');
    if (cta) nodes.push(cta);
    return nodes;
  }

  // Helper to extract image element from a block
  function extractImage(block) {
    const imageContainer = block.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      const img = imageContainer.querySelector('img');
      if (img) return img;
    }
    return null;
  }

  // Collect all card rows
  const rows = [ ['Cards (cards60)'] ];

  // 1. All .imagetextblock blocks (image + text)
  element.querySelectorAll('.imagetextblock').forEach(block => {
    const image = extractImage(block);
    const content = block.querySelector('.cmp-teaser__content');
    if (image && content) {
      const textNodes = extractTextContent(content);
      if (textNodes.length) {
        rows.push([image, textNodes]);
      }
    }
  });

  // 2. All .cmp-container_cards .teaser blocks (no image, just text)
  element.querySelectorAll('.cmp-container_cards .teaser').forEach(teaser => {
    const content = teaser.querySelector('.cmp-teaser__content');
    if (content) {
      const textNodes = extractTextContent(content);
      if (textNodes.length) {
        rows.push(['', textNodes]);
      }
    }
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
