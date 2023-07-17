import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FavouritesService } from './favourites.service';

@Controller('api/users')
export class FavouritesController {
  constructor(private favouritesService: FavouritesService) { }
  
  @UseGuards(JwtAuthGuard)
  @Post(':name/favourites')
  public async create(@Param('name') name: string, @Body('userName') userName: string, @Body('postId') postId: string, @Body('userId') userId: string, @Req() req: Request, @Res() res: Response): Promise<Response> {
    console.log('POST');
    const jwtUserName = (req.user as { name: string; })?.name;
    if(jwtUserName == null) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
    if(name !== userName || name !== jwtUserName || userName !== jwtUserName) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
    
    try {
      console.log('Start 1')
      const inboxUrl = await this.favouritesService.fetchInboxUrl(userId);
      console.log('Start 2')
      await this.favouritesService.postLikeInbox(userName, inboxUrl, postId);
      console.log('Start 3');
      await this.favouritesService.create(userName, postId, inboxUrl);
    }
    catch(error) {
      console.log('ERROR', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
  
  @Get(':name/favourites')
  public async findOne(@Param('name') name: string, @Query('postId') postId: string, @Res() res: Response): Promise<Response> {
    const result = await this.favouritesService.findOne(name, postId);
    return res.status(HttpStatus.OK).json({ result });
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':name/favourites')
  public async remove(@Param('name') name: string, @Body('postId') postId: string, @Req() req: Request, @Res() res: Response): Promise<Response> {
    const jwtUserName = (req.user as { name: string; })?.name;
    if(jwtUserName == null) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'JWT User Name Is Empty' });
    if(name !== jwtUserName) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid User Name' });
    
    try {
      const favourite = await this.favouritesService.findOne(name, postId);
      if(favourite == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'Favourite Not Found' });
      await this.favouritesService.postUnlikeInbox(name, favourite.inboxUrl, postId);
      await this.favouritesService.remove(name, postId);
      return res.status(HttpStatus.OK).end();
    }
    catch(error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
}
