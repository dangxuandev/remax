import { sortBy } from 'lodash';
import { compilation } from 'webpack';
import ejs from 'ejs';
import type { Options, Meta, EntryInfo } from '@remax/types';
import Store from '@remax/build-store';
import SourceCache from '../../../../SourceCache';
import { slash } from '@remax/shared';
import { getUsingComponents } from '../getUsingComponents';

export function createRenderOptions(componentPath: string, compilation: compilation.Compilation, options: Options) {
  const components = new Map(Store.getCollectedComponents(options.UNSAFE_extractOnlyCollectedComponents));

  getUsingComponents(componentPath, compilation, options).forEach(component => {
    components.set(component.id, {
      id: component.id,
      props: component.props,
      type: 'native',
    });
  });

  return {
    components,
    skipComponents: Store.skipHostComponents,
    slotView: {
      props: [...new Set(Store.slotView.props || [])].sort(),
    },
  };
}

export default async function createComponentTemplate(
  component: EntryInfo,
  options: Options,
  meta: Meta,
  compilation: compilation.Compilation,
  cache: SourceCache
) {
  const fileName = slash(`${component.name}${meta.template.extension}`);

  const ejsOptions: { [props: string]: any } = {
    ...createRenderOptions(component.filename, compilation, options),
    renderIsolatedTemplates: false,
    baseTemplate: `/base${meta.template.extension}`,
    sortBy,
  };

  let source: string = await ejs.renderFile(meta.ejs.page, ejsOptions, {
    rmWhitespace: options.compressTemplate,
  });

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
