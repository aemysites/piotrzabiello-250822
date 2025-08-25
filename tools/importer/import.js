/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import columns6Parser from './parsers/columns6.js';
import columns8Parser from './parsers/columns8.js';
import accordion9Parser from './parsers/accordion9.js';
import cards10Parser from './parsers/cards10.js';
import accordion1Parser from './parsers/accordion1.js';
import tabs3Parser from './parsers/tabs3.js';
import cardsNoImages2Parser from './parsers/cardsNoImages2.js';
import accordion15Parser from './parsers/accordion15.js';
import cardsNoImages17Parser from './parsers/cardsNoImages17.js';
import columns18Parser from './parsers/columns18.js';
import columns11Parser from './parsers/columns11.js';
import embedVideo13Parser from './parsers/embedVideo13.js';
import cardsNoImages5Parser from './parsers/cardsNoImages5.js';
import accordion26Parser from './parsers/accordion26.js';
import accordion4Parser from './parsers/accordion4.js';
import accordion20Parser from './parsers/accordion20.js';
import cards7Parser from './parsers/cards7.js';
import columns28Parser from './parsers/columns28.js';
import columns12Parser from './parsers/columns12.js';
import cards14Parser from './parsers/cards14.js';
import accordion33Parser from './parsers/accordion33.js';
import accordion35Parser from './parsers/accordion35.js';
import cardsNoImages36Parser from './parsers/cardsNoImages36.js';
import embedVideo32Parser from './parsers/embedVideo32.js';
import columns39Parser from './parsers/columns39.js';
import accordion22Parser from './parsers/accordion22.js';
import accordion40Parser from './parsers/accordion40.js';
import columns24Parser from './parsers/columns24.js';
import columns38Parser from './parsers/columns38.js';
import accordion42Parser from './parsers/accordion42.js';
import columns44Parser from './parsers/columns44.js';
import embedVideo34Parser from './parsers/embedVideo34.js';
import cardsNoImages46Parser from './parsers/cardsNoImages46.js';
import accordion47Parser from './parsers/accordion47.js';
import cards45Parser from './parsers/cards45.js';
import columns49Parser from './parsers/columns49.js';
import accordion48Parser from './parsers/accordion48.js';
import cardsNoImages51Parser from './parsers/cardsNoImages51.js';
import accordion50Parser from './parsers/accordion50.js';
import columns43Parser from './parsers/columns43.js';
import cardsNoImages41Parser from './parsers/cardsNoImages41.js';
import tableBordered53Parser from './parsers/tableBordered53.js';
import accordion55Parser from './parsers/accordion55.js';
import columns19Parser from './parsers/columns19.js';
import cards37Parser from './parsers/cards37.js';
import columns56Parser from './parsers/columns56.js';
import hero29Parser from './parsers/hero29.js';
import accordion52Parser from './parsers/accordion52.js';
import cardsNoImages57Parser from './parsers/cardsNoImages57.js';
import cards60Parser from './parsers/cards60.js';
import cards31Parser from './parsers/cards31.js';
import cards58Parser from './parsers/cards58.js';
import columns21Parser from './parsers/columns21.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  columns6: columns6Parser,
  columns8: columns8Parser,
  accordion9: accordion9Parser,
  cards10: cards10Parser,
  accordion1: accordion1Parser,
  tabs3: tabs3Parser,
  cardsNoImages2: cardsNoImages2Parser,
  accordion15: accordion15Parser,
  cardsNoImages17: cardsNoImages17Parser,
  columns18: columns18Parser,
  columns11: columns11Parser,
  embedVideo13: embedVideo13Parser,
  cardsNoImages5: cardsNoImages5Parser,
  accordion26: accordion26Parser,
  accordion4: accordion4Parser,
  accordion20: accordion20Parser,
  cards7: cards7Parser,
  columns28: columns28Parser,
  columns12: columns12Parser,
  cards14: cards14Parser,
  accordion33: accordion33Parser,
  accordion35: accordion35Parser,
  cardsNoImages36: cardsNoImages36Parser,
  embedVideo32: embedVideo32Parser,
  columns39: columns39Parser,
  accordion22: accordion22Parser,
  accordion40: accordion40Parser,
  columns24: columns24Parser,
  columns38: columns38Parser,
  accordion42: accordion42Parser,
  columns44: columns44Parser,
  embedVideo34: embedVideo34Parser,
  cardsNoImages46: cardsNoImages46Parser,
  accordion47: accordion47Parser,
  cards45: cards45Parser,
  columns49: columns49Parser,
  accordion48: accordion48Parser,
  cardsNoImages51: cardsNoImages51Parser,
  accordion50: accordion50Parser,
  columns43: columns43Parser,
  cardsNoImages41: cardsNoImages41Parser,
  tableBordered53: tableBordered53Parser,
  accordion55: accordion55Parser,
  columns19: columns19Parser,
  cards37: cards37Parser,
  columns56: columns56Parser,
  hero29: hero29Parser,
  accordion52: accordion52Parser,
  cardsNoImages57: cardsNoImages57Parser,
  cards60: cards60Parser,
  cards31: cards31Parser,
  cards58: cards58Parser,
  columns21: columns21Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  sections: sectionsTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.values(transformers).forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }));

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
