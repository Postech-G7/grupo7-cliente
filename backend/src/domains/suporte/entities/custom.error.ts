export class CustomError extends Error {
  readonly statusCode: number;
  readonly errors: Array<any> | CustomError;
  readonly logging: boolean;
  readonly content: any;

  constructor(
    message: string,
    statusCode: number,
    logging: boolean,
    errors: Array<any> | CustomError
  ) {
    /** Estou no meio de uma viagem de MotorHome, então esse trecho abaixo é aceitável. */

    if (errors instanceof CustomError) {
      super(errors.message);
      this.statusCode = errors.statusCode;
      this.logging = errors.logging;
      this.errors = errors.errors;
    } else {
      super(message);
      this.statusCode = statusCode;
      this.logging = logging;
      this.errors = errors;
      this.content = {};
    }

    if (logging) {
      console.error(errors);
    }
  }
}
