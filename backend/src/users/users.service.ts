import * as crypto from 'node:crypto';
import * as util from 'node:util';

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

import { User } from '../entities/user';

/** 鍵ペアを非同期に生成する */
const generateKeyPairAsync = util.promisify(crypto.generateKeyPair);

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);
  
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }
  
  /**
   * ユーザを登録する
   * 
   * @param user User (Name・Password)
   * @return 登録した User 情報
   * @throws バリデーションエラー時、登録失敗時
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
    const insertResult = await this.usersRepository.insert(user); // Throws
    this.logger.debug('User Created', JSON.stringify(insertResult));
    // Result
    return this.findOne(user.name);
  }
  
  /**
   * ユーザを一意に取得する
   * 
   * @param name Name
   * @return User・見つからなかった場合は `null`
   */
  public async findOne(name: string): Promise<User | null> {
    return this.findOneBase(name, { name: true });
  }
  
  /**
   * ユーザを一意に取得する・パスワードのハッシュ値も取得する
   * 
   * @param name Name
   * @returns User・見つからなかった場合は `null`
   */
  public async findOneWithPassword(name: string): Promise<User | null> {
    return this.findOneBase(name, { name: true, password: true });
  }
  
  /**
   * ユーザを一意に取得する・公開鍵も取得する
   * 
   * @param name Name
   * @returns User・見つからなかった場合は `null`
   */
  public async findOneWithPublicKey(name: string): Promise<User | null> {
    return this.findOneBase(name, { name: true, publicKey: true });
  }
  
  /**
   * ユーザを一意に取得するベース関数
   * 
   * @param name Name
   * @param selectOptions 取得する項目名の連想配列
   * @return User・見つからなかった場合は `null`
   */
  private async findOneBase(name: string, selectOptions: FindOptionsSelect<User>): Promise<User | null> {
    return this.usersRepository.findOne({
      select: selectOptions,
      where: { name }
    });
  }
}
