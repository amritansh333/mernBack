// admin common errors (placeholder)
export class AdminError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export default { AdminError };
