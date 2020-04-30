import * as path from 'path';
import { Compiler } from 'webpack';
import { Options, Entries } from '@remax/types';
import API from '../../../../API';
import createAppManifest from './createAppManifest';
import createPageTemplate, { createBaseTemplate } from './createPageTemplate';
import createTurboPageTemplate from './createTurboPageTemplate';
import createPageManifest from './createPageManifest';
import createPageHelperFile from './createPageHelperFile';
import * as turboPages from '../../../utils/turboPages';
import winPath from '../../../../winPath';
import getModules from '../../../utils/modules';

const PLUGIN_NAME = 'RemaxNativeFilesPlugin';

export default class NativeFilesPlugin {
  api: API;
  remaxOptions: Options;
  entries: Entries;

  constructor(api: API, options: Options, entries: Entries) {
    this.api = api;
    this.remaxOptions = options;
    this.entries = entries;
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync(PLUGIN_NAME, async (compilation, callback) => {
      const options = this.remaxOptions;
      const entries = this.entries;
      const meta = this.api.getMeta();

      // app.json
      await createAppManifest(options, compilation);

      // base template
      await createBaseTemplate(this.api, options, meta, compilation);

      Promise.all(
        entries.pages.map(async pagePath => {
          const chunk = compilation.chunks.find(c => {
            let name = winPath(pagePath).replace(winPath(path.join(options.cwd, options.rootDir)) + '/', '');
            const ext = path.extname(name);
            name = name.replace(new RegExp(`\\${ext}$`), '');
            return c.name === name;
          });

          // TODO: 应该有更好的获取 modules 的方式？
          const modules = [...getModules(chunk), pagePath];

          if (turboPages.validate(pagePath, options)) {
            // turbo page
            await createTurboPageTemplate(this.api, options, pagePath, modules, meta, compilation);
          } else {
            // page template
            await createPageTemplate(this.api, options, pagePath, meta, compilation);
            // page helper
            await createPageHelperFile(options, pagePath, meta, compilation);
          }

          await createPageManifest(options, pagePath, modules, compilation);
        })
      ).then(() => {
        callback();
      });
    });
  }
}
