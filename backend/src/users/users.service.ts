import * as crypto from 'node:crypto';
import * as util from 'node:util';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

import { User } from 'src/entities/user';

const generateKeyPairAsync = util.promisify(crypto.generateKeyPair);

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }
  
  /**
   * ユーザを登録する
   * 
   * @param user User (Name・Password)
   * @return 登録成功したら `true`
   * @throws バリデーションエラー時、登録失敗時
   */
  public async create(user: User): Promise<boolean> {
    // バリデーション
    if(!(/^[a-z0-9-]+$/u).test(user.name)) throw new Error('Invalid User Name');  // ユーザ名 : 英小文字・数字・ハイフンのみ許容する
    if(user.password === '') throw new Error('Invalid Password');  // パスワード : 未入力でなければよしとする
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
    await this.usersRepository.insert(user);  // Throws
    return true;
  }
  
  /** ユーザ一覧を取得する */
  public findAll(): Promise<Array<User> | null> {
    return this.usersRepository.find({ order: { createdAt: 'DESC' }});
  }
  
  /** ユーザを一意に取得する */
  public findOne(name: string): Promise<User | null> {
    return this.findOneBase(name, { name: true, createdAt: true });
  }
  
  /** ユーザを一意に取得する・パスワードのハッシュ値も取得する */
  public findOneWithPassword(name: string): Promise<User | null> {
    return this.findOneBase(name, { name: true, password: true });
  }
  
  /** ユーザを一意に取得する・公開鍵も取得する */
  public findOneWithPublicKey(name: string): Promise<User | null> {
    return this.findOneBase(name, { name: true, createdAt: true, publicKey: true });
  }
  
  /** ユーザを一意に取得する・秘密鍵も取得する */
  public findOneWithPrivateKey(name: string): Promise<User | null> {
    return this.findOneBase(name, { name: true, privateKey: true });
  }
  
  /** ユーザを一意に取得するベース関数
   * 
   * @param name ユーザ名
   * @param selectOptions 取得する項目名の連想配列
   * @return User・見つからなかった場合は `null`
   */
  private findOneBase(name: string, selectOptions: FindOptionsSelect<User>): Promise<User | null> {
    return this.usersRepository.findOne({
      select: selectOptions,
      where: { name }
    });
  }
}
