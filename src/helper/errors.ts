import type { User } from "@/stores/store";

export class ConnectionError extends Error {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ConnectionError.prototype);
  }
}

export class BadPasswordError extends Error {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BadPasswordError.prototype);
  }
}

export class InvalidPropsError extends Error {
  invalidProps: Map<keyof User, string[]> = new Map();
  constructor(
    msg: string = "",
    props: { [index: string]: Array<string> } = {}
  ) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidPropsError.prototype);

    Object.keys(props).forEach((key) => {
      this.invalidProps.set(key as keyof User, props[key]);
    });
  }
}
