import type { PrivateUser } from "./apiCalls";

export class ConnectionError extends Error {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ConnectionError.prototype);
  }
}

export class InvalidSearchError extends Error {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidSearchError.prototype);
  }
}

export class NoUserError extends Error {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NoUserError.prototype);
  }
}

export class BadPasswordError extends Error {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BadPasswordError.prototype);
  }
}

export class UserNotLoggedInError extends Error {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UserNotLoggedInError.prototype);
  }
}

export class InvalidPropsError extends Error {
  invalidProps: Map<keyof PrivateUser, string[]> = new Map();
  constructor(
    msg: string = "",
    props: { [index: string]: Array<string> } = {}
  ) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidPropsError.prototype);

    Object.keys(props).forEach((key) => {
      this.invalidProps.set(key as keyof PrivateUser, props[key]);
    });
  }
}
