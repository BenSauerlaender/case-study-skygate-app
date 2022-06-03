export class ConnectionError extends Error {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ConnectionError.prototype);
  }
}

export class InvalidPropsError extends Error {
  invalidProps: { [index: string]: Array<string> };
  constructor(msg: string = "", props: { [index: string]: Array<string> }) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ConnectionError.prototype);

    this.invalidProps = props;
  }
}
