import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

import { HostUrlService } from 'src/shared/services/host-url.service';
import { SignHeaderService } from 'src/activity-pub/sign-header.service';
import { UsersService } from '../users.service';
import { Favourite } from 'src/entities/favourite';

const headers = {
  headers: {
    Accept        : 'application/activity+json',
    'Content-Type': 'application/activity+json'
  }
};

@Injectable()
export class FavouritesService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Favourite) private favouritesRepository: Repository<Favourite>,
    private hostUrlService: HostUrlService,
    private signHeaderService: SignHeaderService,
    private usersService: UsersService,
  ) { }
  
  public async fetchInboxUrl(actorUrl: string): Promise<string> {
    const actorResponse = await firstValueFrom(this.httpService.get(actorUrl, headers));  // Throws
    return actorResponse?.data?.inbox;
  }
  
  public async postLikeInbox(userName: string, inboxUrl: string, postId: string): Promise<any> {
    const user = await this.usersService.findOneWithPrivateKey(userName);
    const json = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id        : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,  // NOTE : 存在しなくて良いか
      type      : 'Like',
      actor     : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
      object    : postId
    };
    const requestHeaders = this.signHeaderService.signHeader(json, inboxUrl, userName, user.privateKey);
    return firstValueFrom(this.httpService.post(inboxUrl, JSON.stringify(json), { headers: requestHeaders }));  // Throws
  }
  
  public create(userName: string, postUrl: string, inboxUrl: string): Promise<InsertResult> {
    const favourite = new Favourite({ userName, postUrl, inboxUrl });
    return this.favouritesRepository.insert(favourite);  // Throws
  }
  
  public findOne(userName: string, postUrl: string): Promise<Favourite | null> {
    return this.favouritesRepository.findOne({
      where: { userName, postUrl }
    });
  }
  
  public async postUnlikeInbox(userName: string, inboxUrl: string, postId: string): Promise<any> {
    const user = await this.usersService.findOneWithPrivateKey(userName);
    const json = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id        : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,  // NOTE : 存在しなくて良いか
      type      : 'Undo',
      actor     : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
      object    : {
        id      : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}/activities/${Date.now()}`,  // NOTE : 存在しなくて良いか
        type    : 'Like',
        actor   : `${this.hostUrlService.fqdn}/api/activity-pub/users/${userName}`,
        object  : postId
      }
    };
    const requestHeaders = this.signHeaderService.signHeader(json, inboxUrl, userName, user.privateKey);
    return firstValueFrom(this.httpService.post(inboxUrl, JSON.stringify(json), { headers: requestHeaders }));  // Throws
  }
  
  public remove(userName: string, postUrl: string): Promise<DeleteResult> {
    return this.favouritesRepository.delete({ userName, postUrl });
  }
}
