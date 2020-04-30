import * as path from 'path';
import { Options, Platform } from '@remax/types';

interface Alias {
  [key: string]: string;
}

export default (options: Options, target: Platform) => {
  const config: Alias = {
    '@': path.resolve(options.cwd, options.rootDir),
    react: path.resolve(options.cwd, 'node_modules', 'react'),
  };

  if (target !== Platform.web) {
    config['react-dom'] = '@remax/runtime';
  }

  return config;
};
