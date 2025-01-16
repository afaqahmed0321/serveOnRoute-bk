/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export default class AuthRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // public async addRefreshToken(key: string, token: string): Promise<void> {
  //   const result = await this.cacheManager.set(key, token, {
  //     ttl: 31536000,
  //   });
  // }

  public async getToken(key: string): Promise<string | unknown> {
    return await this.cacheManager.get(key);
  }

  public async setForgetOtp(
    key: string,
    value: string,
    expiry = 3600,
    expiryMode = 'EX',
  ): Promise<string | unknown> {
    return await this.cacheManager.set(key, value, 300);
  }

  public async getForgetOtp(key: string): Promise<string | unknown> {
    return await this.cacheManager.get(`forget#${key}`);
  }

  public removeToken(key: string): Promise<number> {
    return this.cacheManager.del(key);
  }
}
