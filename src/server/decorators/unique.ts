import 'reflect-metadata';

export const classes: { [key: string]: boolean } = {};

/**
 * Class decorator that flag the decorated class's name as unique
 * when a class is flagged as unique this means that it is the only class
 * in the codebase that has that name
 * any other class declared with the same name will throw an exception
 *
 *
 * This decorator was created to deal with swagger-typescript-rest openapi generation
 * because when two distinct requests params or responses return a class with the same name
 * the library will use one of the classes to override the other matching class definition
 * which leads to a badly generated openapi documentation which doesn't reflect the reality of the routes
 *
 *
 *
 * @param target the class to decorate
 */
export function unique(target: any): any {
  const regexpResult = /(?<=class).\w*\s?/.exec(target);
  if (!regexpResult || regexpResult.length === 0) {
    throw new Error(`malformed class declaration for ${target}`);
  }
  const className = regexpResult[0].replace(new RegExp(' ', 'g'), '');
  if (classes[className]) {
    throw new Error(`the class ${className} is flagged as unique but another class with the same name was found`);
  }
  classes[className] = true;
}
