declare module 'benv' {
  export function setup(callback: () => void): void;
  export function expose(modules: { [name: string]: any }): void;
  export function require(path: string, name: string): any;
}
