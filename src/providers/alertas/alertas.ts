import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the AlertasProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AlertasProvider {

  loading: any;

  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, public storage: Storage) {

  }

  presentLoading(contenido,opcion,timeout) {
    if(opcion === 0){
      this.loading = this.loadingCtrl.create({        
          spinner: 'hide',
          content: contenido        
      });
    }

    if(opcion === 1){
      this.loading = this.loadingCtrl.create({        
          content: contenido        
      });
    }

    this.loading.present();
    if(timeout === 1){
      setTimeout(() => {
        this.loading.dismiss();
      }, 3000);
    }
    
  }

  presentLoadingClose(){
      this.loading.dismiss();
  }

  presentAlert(titulo,subtitulo) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: subtitulo,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  presentConfirm(titulo,mensaje) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            //this.storage.set('alerta', false);
            alert.dismiss(false);
            return false;
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Buy clicked');
            //this.storage.set('alerta', true);
            alert.dismiss(true);
            return false;
          }
        }
      ]
    });
    alert.present();
    return alert;
  }
}
