import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  ActionSheetController
} from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../tabs/tabs';


interface User {
  email: string;
  password: string;
}

const initUser: User = {
  email: '',
  password: '',
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public afDatabase: AngularFireDatabase,
    public actionSheetCtrl: ActionSheetController,
    private _firebaseAuth: AngularFireAuth,
    private _storage: Storage,
  ) {
    this.authUser = _firebaseAuth.authState;
  }

  user: User = initUser;
  private authUser: Observable<firebase.User>;

  ngOnInit() {
    const tabs: any = document.querySelector('.tabbar.show-tabbar');
    if(tabs) {
      tabs.style.display = 'none';
    }
  }

  registerUser() {
    firebase.auth.EmailAuthProvider.credential( this.user.email, this.user.password );
    this._firebaseAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then((res) => {
        this._storage.set('user', res.email);
        this.gotoHome();
      })
      .catch((err) => this.presentAlert('Registration Error', 'User already existing'));
  }

  logIn() {
    this._firebaseAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password)
      .then((res) => {
        this._storage.set('user', res.email);
        this.gotoHome();
      })
      .catch((err) => this.presentAlert('Login Error', 'Invalid Username or Password'));
  }

  public gotoHome() {
    this.navCtrl.push(TabsPage);
  }

  private presentAlert(title: string, subTitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    alert.present();
  }
}
