import {Component, Inject, Injectable, INJECTOR, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { Location } from "@angular/common";
import {UserLdap} from "../model/user-ldap";
import {UsersService} from "../service/users.service";
import {Form, FormBuilder} from "@angular/forms";
import {ConfirmValidParentMatcher, passwordValidator} from "./passwords-validator.directive";


export abstract class LdapDetailComponent {
  user: UserLdap;
  processLoadRunning = false;
  processValidateRunning = false;
  passwordPlaceHolder: string;
  errorMessage = '';
  confirmValidParentMatcher = new ConfirmValidParentMatcher();

  userForm = this.fb.group({
    login: [''], // valeur de depart vide
    nom: [''],
    prenom: [''],
    // Groupe de données imbriquées
    passwordGroup: this.fb.group({
      password: [''],
      confirmPassword: ['']
    }, {validators: passwordValidator}),
    mail: {value: '', disabled: true},
  });
  protected constructor(
    public addForm: boolean,
    /* a voir protected route: ActivatedRoute*/
    private fb: FormBuilder,
    private router: Router,

    ) {
    this.passwordPlaceHolder = 'Mot de passe' + (this.addForm ? '' : '(vide si inchangé)');
  }

  protected onInit(): void {
    // permet d'initialiser le formulaire au cas ou, pas besoin ici
  }


  private formGetValue(name: string): any {
    return this.userForm.get(name).value;
  }
  goToLdap(): void {
    this.router.navigate(['/users/list']);
  }

  abstract validateForm(): void;
  onSubmitForm() {
    this.validateForm();
  }
  updateLogin(): void {
    if (this.addForm) {
      this.userForm.get('login').setValue((this.formGetValue('prenom')
        + '.' + this.formGetValue('nom')).toLowerCase());
      this.updateMail();
    }
  }
  updateMail(): void {
    if (this.addForm) {
      this.userForm.get('mail').setValue(this.formGetValue('login').toLowerCase()
        + '@domain.com')
    }
  }
  isFormValid(): boolean {
    return this.userForm.valid
      && (this.addForm || this.formGetValue('passwordGroup.password') !== '');
  }

  // permet d'afficher les proprietes de userLdap dans le formulaire
  protected copyUserToFormControl(): void {
    this.userForm.get('login').setValue(this.user.login);
    this.userForm.get('nom').setValue(this.user.nom);
    this.userForm.get('prenom').setValue(this.user.prenom);
    this.userForm.get('mail').setValue(this.user.mail);
    /* Il faudra ajouter les champs suivant au formulaire
    this.userForm.get('employeNumero').setValue(this.user.employeNumero);
    this.userForm.get('employeNiveau').setValue(this.user.employeNiveau);
    this.userForm.get('dateEmbauche').setValue(this.user.dateEmbauche);
    this.userForm.get('publisherId').setValue(this.user.publisherId);
    this.userForm.get('active').setValue(this.user.active);
    */
  }
  // Permet de récupérer les valeurs du formulaire et
  // de retourner un objet UserLdap avec ces valeurs
  protected getUserFromFormControl(): UserLdap {
    return {
      login: this.userForm.get('login').value,
      nom: this.userForm.get('nom').value,
      prenom: this.userForm.get('prenom').value,
      nomComplet: this.userForm.get('nom').value + ' ' + this.userForm.get('prenom').value,
      mail: this.userForm.get('mail').value,
      // Les valeurs suivantes devraient être eprise du formulaire
      employeNumero: 1, // this.userForm.get('employeNumero').value,
      employeNiveau: 1, // this.userForm.get('employeNiveau').value,
      dateEmbauche: '2020-04-24', // this.userForm.get('dateEmbauche').value,
      publisherId: 1, // this.userForm.get('publisherId').value,
      active: true,
      motDePasse: '',
      role: 'ROLE_USER'
    };
  }

}
