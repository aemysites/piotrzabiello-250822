/* global WebImporter */
export default function parse(element, { document }) {
  // Safety: ensure .cmp-tabs exists
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // 1. Extract tab labels
  const tabLabelEls = tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab');
  const tabLabels = Array.from(tabLabelEls).map(li => (li.textContent || '').trim());

  // 2. Extract tab contents (panels)
  // There could be more panels than tab labels if some are hidden; match order of appearance
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-accordion__panel.cmp-tabs__tabpanel'));

  const rows = [['Tabs']]; // Header row

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent = null;
    if (panel) {
      // Try to find main content container (skip possible wrapper divs)
      let contentContainer = panel.querySelector('.container.responsivegrid, .cmp-container, .cmp-text');
      // In some panels, there is nested .container > .cmp-container > .cmp-text or .cmp-text
      // We want the deepest single .cmp-text or .cmp-container, not the parent wrappers
      if (contentContainer) {
        // If there's only one child and it's a .cmp-container, dig deeper
        let cmpContainer = contentContainer.querySelector(':scope > .cmp-container');
        if (cmpContainer) {
          // Might go deeper if only one .cmp-text in cmpContainer
          let innerText = cmpContainer.querySelector(':scope > .cmp-text');
          if (innerText) {
            tabContent = innerText;
          } else {
            tabContent = cmpContainer;
          }
        } else {
          tabContent = contentContainer;
        }
      } else {
        // As fallback, use all children of the panel
        if (panel.children.length === 1) {
          tabContent = panel.firstElementChild;
        } else {
          // Wrap all children in a div to preserve block
          const wrapper = document.createElement('div');
          Array.from(panel.childNodes).forEach(n => wrapper.appendChild(n));
          tabContent = wrapper;
        }
      }
    } else {
      // Panel missing: just leave cell empty or with a note
      tabContent = document.createTextNode('');
    }
    rows.push([label, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
