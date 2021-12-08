declare module 'module-alias/register';

declare module '*.json' {
  const value: { [key: string]: any };
  export default value;
}
