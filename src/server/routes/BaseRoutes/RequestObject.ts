export class BaseRO {
  public serialize(data: { [key: string]: any }) {
    if (data && Object.keys(data).length) {
      Object.keys(data)
        .filter((key) => key in this)
        .forEach((key) => ((this as any)[key] = data[key]));
    }

    return this;
  }
}
