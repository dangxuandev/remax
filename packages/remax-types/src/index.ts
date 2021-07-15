import * as React from 'react';
import yargs from 'yargs';
import WebpackConfig from 'webpack-chain';
import * as t from '@babel/types';

export type LogLevel = 'debug' | 'verbose' | 'info' | 'warn' | 'error' | 'silent';

export type Platform = 'web' | 'wechat' | 'ali' | 'toutiao';

export type BuildType = 'miniapp' | 'miniplugin' | 'minicomponent' | 'webapp';

export type WebOptions = {
  mpa: boolean;
  excludeNodeModulesTransform: boolean;
};

export interface PluginOptions {
  errorScreen: boolean;
  spm: boolean;
}

export interface BuildOptions {
  turboRenders?: boolean;
  pxToRpx: boolean;
  cwd: string;
  progress: boolean;
  input?: string[] | string | { [key: string]: string };
  output: string;
  rootDir: string;
  compressTemplate?: boolean;
  UNSAFE_wechatTemplateDepth: number | { [key: string]: number };
  UNSAFE_extractOnlyCollectedComponents?: boolean;
  configWebpack?: (params: { config: WebpackConfig; webpack: any }) => void;
  plugins: Plugin[];
  port?: number;
  notify?: boolean;
  watch?: boolean;
  target?: Platform;
  analyze?: boolean;
  devtools?: boolean;
  type?: BuildType;
  component?: any;
  web?: WebOptions;
  minimize?: boolean;
  loglevel?: LogLevel;
}

export type Options = BuildOptions & PluginOptions;

export type Config = Partial<Options>;

export interface EntryInfo {
  name: string;
  filename: string;
  component?: boolean;
}

export interface Entries {
  app: EntryInfo;
  pages: EntryInfo[];
}

export interface AppConfigPlugins {
  [key: string]: {
    version: string;
    provider: string;
  };
}

export interface AppConfig {
  pages: string[];
  subpackages?: Array<{
    root: string;
    pages: string[];
    plugins?: AppConfigPlugins;
  }>;
  subPackages?: Array<{
    root: string;
    pages: string[];
    plugins?: AppConfigPlugins;
  }>;
  tabBar?: {
    items?: Array<{ icon: string; activeIcon: string }>;
    list?: Array<{ iconPath: string; selectedIconPath: string }>;
  };
  plugins?: AppConfigPlugins;
}

export interface MiniPluginConfig {
  pages: string[];
  publicComponents: { [key: string]: string };
  publicPages: { [key: string]: string };
  main: string;
}

export type Meta = {
  global: string;
  template: {
    extension: string;
    tag: string;
    src: string;
  };
  style: string;
  jsHelper?: {
    extension: string;
    tag: string;
    src: string;
  };
  ejs: {
    base?: string;
    page: string;
    jsHelper?: string;
  };
  staticEjs?: {
    base?: string;
    page: string;
    jsHelper?: string;
    isolatedTemplates?: string;
  };
};

export type MetaOptions = {
  remaxOptions: Options;
};

export type ProcessPropsOptions = {
  componentName: string;
  props: string[];
  node?: t.JSXElement;
  additional?: boolean;
};

export type ShouldHostComponentRegister = {
  componentName: string;
  additional?: boolean;
  phase: 'import' | 'jsx' | 'extra';
};

export interface HostComponent {
  props: string[];
  additional?: boolean;
  alias?: { [key: string]: string };
}

export interface ComponentManifest {
  id: string;
  props: string[];
  additional?: boolean;
  type?: string;
}

export interface Plugin {
  /** 插件名称 */
  meta?: Meta;
  hostComponents?: Map<string, HostComponent>;
  /**
   * 自定义组件属性
   * options.componentName 组件名称
   * options.props 组件属性
   * options.node 组件 babel JSXElement
   * options.additional 是否用户额外创建的 host 组件
   */
  processProps?: (options: ProcessPropsOptions) => string[];
  /**
   * 是否注册组件
   * options.componentName 组件名称
   * options.additional 是否是额外定义的组件
   * options.phase 组件被引入的阶段，import | jsx | extra
   */
  shouldHostComponentRegister?: (options: ShouldHostComponentRegister) => boolean;

  onBuildStart?: (params: { config: Options }) => void;

  /**
   * 修改 webpack 配置
   */
  configWebpack?: (params: { config: WebpackConfig }) => void;

  /**
   * 修改 babel 配置
   */
  configBabel?: (params: { config: any }) => void;

  /**
   * 注册运行时插件
   */
  registerRuntimePlugin?: () => string;

  /**
   * 修改应用配置
   */
  onAppConfig?: (params: { config: any }) => any;

  /**
   * 修改页面配置
   */
  onPageConfig?: (params: { config: any; page: string }) => any;

  /**
   * 修改页面输出的 template
   */
  onPageTemplate?: (params: { template: string; page: string }) => string;

  /**
   * 扩展命令行
   */
  extendCLI?: (params: { cli: yargs.Argv }) => any;
}

export type PluginConstructor = (options?: any) => Plugin;

export interface RuntimePlugin {
  onAppConfig?: ({ config }: { config: any }) => any;
  onPageConfig?: ({ config, page }: { config: any; page: string }) => any;
  onAppComponent?: ({ component }: { component: React.ComponentType<any> }) => React.ComponentType<any>;
  onPageComponent?: ({
    component,
    page,
  }: {
    component: React.ComponentType<any>;
    page: string;
  }) => React.ComponentType<any>;
  onMiniComponent?: ({
    component,
    context,
  }: {
    component: React.ComponentType<any>;
    context: any;
  }) => React.ComponentType<any>;
  onCreateHostComponent?: ({
    component,
  }: {
    component: React.ForwardRefExoticComponent<any> | React.ComponentType<any>;
  }) => React.ForwardRefExoticComponent<any> | React.ComponentType<any>;
  onCreateHostComponentElement?: ({ element }: { element: React.ReactElement<any> }) => React.ReactElement<any>;
}
