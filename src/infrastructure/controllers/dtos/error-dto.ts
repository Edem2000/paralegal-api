import { MultiLanguage } from 'domain/_core';

export type ErrorDto = {
  success: boolean,
  errorMessage: MultiLanguage,
  errorCode: number,
}