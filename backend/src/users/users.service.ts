import * as crypto from 'node:crypto';
import * as util from 'node:util';

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

import { User } from '../entities/user';

/** Generate Key Pair Async */
const generateKeyPairAsync = util.promisify(crypto.generateKeyPair);

/** Users Service */
@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);
  
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }
  
  /**
   * 登録する
   * 
   * @param user User (Name・Password)
   * @return 登録した User 情報
   */
  public async create(user: User): Promise<User> {
    // ユーザ名 : 英小文字・数字・ハイフンのみ許容する
    if(!(/^[a-z0-9-]+$/u).test(user.name)) throw new Error('Invalid User Name');
    // パスワード : 未入力でなければよしとする
    if(user.password === '') throw new Error('Invalid Password');
    
    // パスワードをハッシュ化する
    const salt = await bcryptjs.genSalt();
		const hash = await bcryptjs.hash(user.password, salt);
    user.password = hash;
    
    // 鍵ペアを作る
    const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding : { type: 'spki' , format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    user.publicKey  = publicKey;
    user.privateKey = privateKey;
      
    // Insert
    const insertResult = await this.usersRepository.insert(user);
    this.logger.debug('User Created', JSON.stringify(insertResult));
    // Result
    return this.findOne(user.name);
  }
  
  /**
   * 一意に取得する
   * 
   * @param name Name
   * @return User (パスワードは取得しない)・見つからなかった場合は `null`
   */
  public async findOne(name: string): Promise<User | null> {
    const user = this.usersRepository.findOne({
      select: { name: true },
      where: { name }
    });
    return user;
  }
  
  /**
   * 一意に取得する・パスワードのハッシュ値も取得する
   * 
   * @param name Name
   * @returns User (パスワードのハッシュ値も取得する)・見つからなかった場合は `null`
   */
  public async findOneWithPassword(name: string): Promise<User | null> {
    return this.usersRepository.findOne({
      select: { name: true, password: true },
      where: { name }
    });
  }
  
  /**
   * 一意に取得する・公開鍵も取得する
   * 
   * @param name Name
   * @returns User (公開鍵も取得する)・見つからなかった場合は `null`
   */
  
  public async findOneWithPublicKey(name: string): Promise<User | null> {
    return this.usersRepository.findOne({
      select: { name: true, publicKey: true },
      where: { name }
    });
  }
}
