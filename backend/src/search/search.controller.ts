import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { SearchService } from './search.service';

@Controller('api/search')
export class SearchController {
  constructor(private searchService: SearchService) { }
  
  /** 検索する */
  @Get('')
  public async search(@Query('query') query: string, @Res() res: Response): Promise<Response> {
    const result = await this.searchService.search(query);
    if(result == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'Results Not Found' })
    return res.status(HttpStatus.OK).json(result);
  }
}
