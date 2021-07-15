import * as crypto from 'crypto';
import { kebabCase } from 'lodash';
import type { ComponentManifest, HostComponent } from '@remax/types';
import { slash } from '@remax/shared';

export interface ExtractedTemplate {
  template: string;
  id: string;
  module: string;
  isEntry: boolean;
  isolated?: boolean;
}

function unique(array: any[]) {
  return Array.from(new Set(array));
}

function generatePathHash(path: string) {
  const hash = crypto.createHash('sha256');
  hash.update(path);
  return hash.digest('hex').slice(0, 7);
}

function generateComponentId(path: string) {
  const [basename, dirname] = path.replace(/\.js$/, '').split('/').reverse();
  const hash = generatePathHash(path);
  return [kebabCase(dirname), kebabCase(basename), hash].filter(Boolean).join('-');
}

const Store = {
  collectedComponents: new Map() as Map<string, ComponentManifest>,
  registeredHostComponents: new Map() as Map<string, HostComponent>,
  compositionComponents: new Map() as Map<string, Map<string, { import: string; props: Set<string> }>>,
  nativeComponents: new Map() as Map<string, { id: string }>,
  pluginComponents: new Map() as Map<
    string,
    { id: string; componentPath: string; importers: Set<string>; props: Set<string> }
  >,
  skipHostComponents: [] as string[],

  appEvents: new Map() as Map<string, Set<string>>,
  pageEvents: new Map() as Map<string, Set<string>>,

  slotView: {
    id: 'slot-view',
    props: [],
  } as { id: string; props: string[] },

  extractedTemplates: new Map() as Map<string, ExtractedTemplate>,

  templateId: 1,

  registerNativeComponent(componentPath: string, output: string) {
    let component = this.nativeComponents.get(componentPath);
    if (!component) {
      const id = generateComponentId(output);
      component = {
        id,
      };
    }
    this.nativeComponents.set(componentPath, component);
    return component.id;
  },

  registerPluginComponent(componentPath: string, importer: string) {
    let component = this.pluginComponents.get(componentPath);
    if (!component) {
      const id = generateComponentId(componentPath);
      component = {
        id,
        componentPath,
        importers: new Set(),
        props: new Set(),
      };
    }
    component.importers.add(importer);
    this.pluginComponents.set(componentPath, component);
    return component.id;
  },

  getCollectedComponents(onlyCollectedComponents = false) {
    const resComponents = new Map(this.collectedComponents);
    if (!onlyCollectedComponents) {
      this.registeredHostComponents.forEach((component, key) => {
        if (!this.collectedComponents.has(key)) {
          resComponents.set(key, {
            id: key,
            props: unique(component.props).sort(),
            additional: component.additional,
          });
        }
      });
    }
    return resComponents;
  },

  generateTemplateId(filename: string) {
    const id = this.templateId;
    const hash = generatePathHash(slash(filename));
    this.templateId += 1;
    return [hash, id.toString()].join('-');
  },

  resetTemplateId() {
    this.templateId = 1;
  },

  reset() {
    this.collectedComponents.clear();
    this.registeredHostComponents.clear();
    this.compositionComponents.clear();
    this.nativeComponents.clear();
    this.pluginComponents.clear();
    this.slotView.props = [];
    this.extractedTemplates.clear();
    this.appEvents.clear();
    this.pageEvents.clear();
    this.templateId = 1;
  },
};

export default Store;
