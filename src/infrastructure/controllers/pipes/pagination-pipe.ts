import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PaginationPipe implements PipeTransform {
  private readonly defaultPage = 1;
  private readonly defaultLimit = 10;
  private readonly maxLimit = 100;

  transform(value: any, metadata: ArgumentMetadata) {
    const page = parseInt(value.page, 10);
    const limit = parseInt(value.limit, 10);

    return {
      ...value,
      page: Number.isNaN(page) || page < 1 ? this.defaultPage : page,
      limit: Number.isNaN(limit) || limit < 1 ? this.defaultLimit : Math.min(limit, this.maxLimit),
      sortOrder: value.sortOrder || 'desc',
    };
  }
}
