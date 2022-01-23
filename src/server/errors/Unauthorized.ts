export class Unauthorized extends Error {
  constructor(public message: string = 'Not Authorized', public status = 403) {
    super(message);
  }
}
