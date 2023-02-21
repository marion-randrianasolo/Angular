import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import { LDAP_USERS } from '../model/ldap-mock-data';
import { UserLdap } from '../model/user-ldap';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  constructor() { }

  // Liste des utilisateurs
  users: UserLdap[] = LDAP_USERS;

  getUsers(): Observable<UserLdap[]> {
    return of(this.users);
  }

  getUser(login: string):Observable<UserLdap> {
    return of (this.users.find(user => user.login === login));
  }

  addUser(user: UserLdap): Observable<UserLdap> {
    this.users.push(user);
    return of(user);
  }

  updateUser(userToUpdate: UserLdap): Observable<UserLdap> {
    const user = this.users.find( u => u.login === userToUpdate.login);
    if (user) {
      user.nom = userToUpdate.nom;
      user.prenom = userToUpdate.prenom;
      user.nomComplet = user.nom + ' ' + user.prenom;
      user.motDePasse = userToUpdate.motDePasse;

      return of(userToUpdate);
    }

    return throwError('Utilisateur non trouvé');
  }
}
