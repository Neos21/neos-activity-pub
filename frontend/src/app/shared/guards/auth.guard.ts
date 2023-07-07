import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * 遷移前に認証チェックする
 * 
 * @param _route ActivatedRouteSnapshot
 * @param _state RouterStateSnapshot
 * @return 遷移してよければ `true`、遷移させたくなければ `false` を返す
 */
export const authGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean => {
  const authService = inject(AuthService);
  if(authService.accessToken) return true;  // ログイン済みであれば遷移を許可する
  if(authService.autoReLogin()) return true;  // 再ログインできれば遷移を許可する
  // ログイン済でなければログイン画面に返す
  const router = inject(Router);
  router.navigate(['/login']);
  return false;
};
