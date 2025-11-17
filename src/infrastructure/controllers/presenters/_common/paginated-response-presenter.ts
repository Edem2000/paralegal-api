export class PaginatedResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;

  constructor(partial: Partial<PaginatedResponseDto<T>>) {
    Object.assign(this, partial);
  }
}