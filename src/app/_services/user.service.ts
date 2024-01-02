import { UserAuthService } from './user-auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  PATH_OF_API = 'http://localhost:9090';
  requestHeader = new HttpHeaders({ 'No-Auth': 'true' });
  constructor(
    private httpClinet: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  public register(registerData: any) {
    return this.httpClinet.post(
      this.PATH_OF_API + '/registerNewUser',
      registerData
    );
  }

  public login(loginData: any) {
    return this.httpClinet.post(this.PATH_OF_API + '/authenticate', loginData, {
      headers: this.requestHeader,
    });
  }

  public forUser() {
    return this.httpClinet.get(this.PATH_OF_API + '/forUser', {
      responseType: 'text',
    });
  }

  public forAdmin() {
    return this.httpClinet.get(this.PATH_OF_API + '/forAdmin', {
      responseType: 'text',
    });
  }

  public roleMatch(allowedRoles: any): any {
    let isMatch = false;
    const userRoles: any = this.userAuthService.getRoles();
    if (userRoles !== null && userRoles) {
      for (let i = 0; i < userRoles.length; i++) {
        for (let j = 0; j < allowedRoles.length; j++) {
          if (userRoles[i].roleName === allowedRoles[j]) {
            isMatch = true;
            return isMatch;
          } else {
            return isMatch;
          }
        }
      }
    }
  }
}
