import { CustomError } from 'domain/utils/errors';

export class ErrorPresenter {
  static present(error: CustomError){
    return {
      success: false,
      errorMessage: error.errorMessage,
      errorCode: error.errorCode,
    }
  }
}