export default class IndexOutOfBoundsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IndexOutOfBoundsError';
  }
}
