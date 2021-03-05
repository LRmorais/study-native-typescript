import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string; // indica que qualquer coisa pode ser uma string
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
