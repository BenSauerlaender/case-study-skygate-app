import type { FormInputs } from "./types";

/**
 * Base error for all Errors that come from api communication
 */
export class ApiError extends Error {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Will be thrown if the search query is invalid
 */
export class InvalidSearchError extends ApiError {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidSearchError.prototype);
  }
}

/**
 * Will be thrown if a verification is already done
 */
export class AlreadyVerifiedError extends ApiError {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AlreadyVerifiedError.prototype);
  }
}
/**
 * Will be thrown if specified user cant be found
 */
export class NoUserError extends ApiError {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NoUserError.prototype);
  }
}

/**
 * Will be thrown if the specified password is wrong
 */
export class BadPasswordError extends ApiError {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BadPasswordError.prototype);
  }
}

/**
 * will be thrown if the accessToken is not valid
 */
export class UserNotLoggedInError extends ApiError {
  constructor(msg: string = "") {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UserNotLoggedInError.prototype);
  }
}

/**
 * will be thrown if specified properties are invalid
 */
export class InvalidPropsError extends ApiError {
  invalidProps: Map<keyof FormInputs, string[]> = new Map();
  constructor(
    msg: string = "",
    props: { [index: string]: Array<string> } = {}
  ) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidPropsError.prototype);

    Object.keys(props).forEach((key) => {
      this.invalidProps.set(key as keyof FormInputs, props[key]);
    });
  }
}
