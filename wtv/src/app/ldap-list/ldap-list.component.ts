import { Component, OnInit, ViewChild } from '@angular/core';
import { UserLdap } from '../model/user-ldap';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UsersService } from '../service/users.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ldap-list',
  templateUrl: './ldap-list.component.html',
  styleUrls: ['./ldap-list.component.css']
})
export class LdapListComponent implements OnInit {
  displayedColumns: string[] = ['nomComplet', 'mail', 'employeNumero'];
  dataSource = new MatTableDataSource<UserLdap>([]);

  /* Ce décorateur permet d’injecter la référence mat-paginator dans l‘attribut
paginator. (Angular traduit le composant MatPaginator avec la balise mat-paginator). Autrement dit
l’attribut paginator de la classe LdapListComponent est lié à la balise HTML mat-paginator après la
création de la vue. */

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private usersService: UsersService, private router: Router) { }

  /* La méthode ngOnInit permet de lier le composant mais il n’est pas initialisé. Le composant sera
disponible après la création de la vue. */

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: UserLdap, filter: string) =>
      this.filterPredicate(data, filter);

    this.getUsers();
  }

  filterPredicate(data, filter): boolean {
    return !filter || data.nomComplet.toLowerCase().startsWith(filter);
  }
  applyFilter($event: KeyboardEvent): void {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  unactiveSelected = false;

  private getUsers(): void {
    this.usersService.getUsers().subscribe(
      users => {
        if (this.unactiveSelected) {
          this.dataSource.data = users.filter( user =>
            user.active === false
          );
        } else {
          this.dataSource.data = users
        }
      });
  }

  unactiveChanged($event: MatSlideToggleChange): void {
    this.unactiveSelected = $event.checked;
    this.getUsers();
  }

  edit(login: string){
    this.router.navigate(['/user',login]).then((e)=> {
      if (! e) {
        console.log("Navigation has failed !")
      }
    })
  }

  addUser() {
    this.router.navigate(['/user/add']).then( (e) => {
      if (! e ){
        console.log("Navigation has failed !")
      }
    });
  }

}
