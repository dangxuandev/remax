import { sortBy } from 'lodash';
import { compilation } from 'webpack';
import ejs from 'ejs';
import type { Options, Meta, EntryInfo } from '@remax/types';
import Store from '@remax/build-store';
import SourceCache from '../../../../SourceCache';
import { getUsingComponents } from '../getUsingComponents';
import { slash } from '@remax/shared';
import API from '../../../../API';
import NormalEntry from '../../../entries/NormalEntry';
import PageEntry from '../../../entries/PageEntry';
import { ensureDepth } from '../../../../defaultOptions/UNSAFE_wechatTemplateDepth';

export function createRenderOptions(
  page: string,
  compilation: compilation.Compilation,
  options: Options,
  filter = true
) {
  const components = new Map(Store.getCollectedComponents(options.UNSAFE_extractOnlyCollectedComponents));

  if (filter) {
    getUsingComponents(page, compilation, options).forEach(component => {
      components.set(component.id, {
        id: component.id,
        props: component.props,
        type: 'native',
      });
    });
  }

  return {
    components,
    skipComponents: Store.skipHostComponents,
    slotView: {
      props: [...new Set(Store.slotView.props || [])].sort(),
    },
  };
}

export default async function createPageTemplate(
  api: API,
  options: Options,
  page: EntryInfo,
  meta: Meta,
  compilation: compilation.Compilation,
  cache: SourceCache
) {
  const fileName = slash(`${page.name}${meta.template.extension}`);

  const ejsOptions: { [props: string]: any } = {
    ...createRenderOptions(page.filename, compilation, options),
    baseTemplate: `/base${meta.template.extension}`,
    sortBy,
  };

  if (meta.jsHelper) {
    ejsOptions.jsHelper = `./${page.name}_helper${meta.jsHelper.extension}`;
  }

  let source: string = await ejs.renderFile(meta.ejs.page, ejsOptions, {
    rmWhitespace: options.compressTemplate,
  });

  source = api.onPageTemplate({ template: source, page: page.name });

  /* istanbul ignore next */
  if (options.compressTemplate) {
    source = source.replace(/^\s*$(?:\r\n?|\n)/gm, '').replace(/\r\n|\n/g, ' ');
  }

  cache.invalid(fileName, source, () => {
    compilation.assets[fileName] = {
      source: () => source,
      size: () => Buffer.byteLength(source),
    };
  });
}

export async function createBaseTemplate(
  pages: Map<string, NormalEntry>,
  options: Options,
  meta: Meta,
  compilation: compilation.Compilation,
  cache: SourceCache
) {
  if (!meta.ejs.base) {
    return null;
  }

  const components = new Map(Store.getCollectedComponents(options.UNSAFE_extractOnlyCollectedComponents));

  pages.forEach(page => {
    if (page instanceof PageEntry) {
      getUsingComponents(page.filename, compilation, options).forEach(component => {
        components.set(component.id, {
          id: component.id,
          props: component.props,
          type: 'native',
        });
      });
    }
  });

  const slotView = {
    props: [...new Set(Store.slotView.props || [])].sort(),
  };

  let source: string = await ejs.renderFile(
    meta.ejs.base,
    {
      components,
      skipComponents: Store.skipHostComponents,
      slotView,
      sortBy,
      depth: ensureDepth(options.UNSAFE_wechatTemplateDepth),
    },
    {
      rmWhitespace: options.compressTemplate,
    }
  );

  /* istanbul ignore next */
  if (options.compressTemplate) {
    source = source.replace(/^\s*$(?:\r\n?|\n)/gm, '').replace(/\r\n|\n/g, ' ');
  }

  const fileName = `base${meta.template.extension}`;

  cache.invalid(fileName, source, () => {
    compilation.assets[fileName] = {
      source: () => source,
      size: () => Buffer.byteLength(source),
    };
  });
}
