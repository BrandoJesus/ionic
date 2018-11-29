import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { VentaPage } from '../venta/venta';
import { AlertasProvider } from '../../providers/alertas/alertas';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  	@ViewChild('usuario') usuario;
  	@ViewChild('contrasena') contrasena;

  	errorMessage: string = '';
    usuarios:any = [];
    configuracion: any = [];
    ruta: string = '';
	 
	constructor(private navCtrl: NavController, public http: Http, public storage: Storage, public alerta: AlertasProvider) {
    this.http = http;
    this.storage = storage;
    this.ruta = "https://www.bitnetperu.com/clientes/rintisa/app/";   
  }

  login(usuario, clave) {
    var link = this.ruta + 'usuarios.php';

    let options:any = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };
    const val = { usuario: usuario, clave: clave };

    this.http.post(link, val, options)
    .subscribe(data => {
      console.log('login ', data);
      this.usuarios = JSON.parse(data['_body']);
      if(this.usuarios.length){
        this.usuarios = this.usuarios[0];
        if(this.usuarios.estado == '1'){
          console.log('this.usuarios: ', this.usuarios);
          this.alerta.presentLoadingClose();
          this.storage.set('logueado',true);
          this.storage.set('usu_regi',this.usuarios.id);
          this.storage.set('usuarios', this.usuarios);

          this.navCtrl.setRoot(VentaPage);

        } else  {
          this.alerta.presentLoadingClose();
          this.errorMessage = "Usuario bloqueado";
        }
      } else {
        this.alerta.presentLoadingClose();
        this.errorMessage = "Usuario y/o contraseña incorrecta";
      }      
    }, error => {
      console.log("Ocurrio un error al descargar los usuarios!", error);
    });
  }
  
  ionViewCanEnter(){
    this.storage.get('logueado').then((val)=>{
      if(val){
        this.navCtrl.setRoot(VentaPage);
      }
    });
  }

  ionViewWillEnter(){
    var link1 = this.ruta + 'configuracion.php';
   
    this.http.get(link1)
    .subscribe(data => {
      this.configuracion = JSON.parse(data['_body']); 
      this.storage.set('configuracion',this.configuracion);      
    }, error => {
      console.log("Ocurrio un error al descargar la configuracion!", error);
    });
  }

  buscarUsuario(buscar,array){
    var n=-1;
    var valor;
    for (var i = 0; i < array.length; i++) {
        valor = array[i].usuario;
        if (valor == buscar) {
            n = i;            
        }
    }
    if(n >= 0)
      return array[n];
    else
      return n;
  }
	
	doLogin() {
		if(this.usuario.value === ''){
			this.errorMessage = "Ingrese un usuario"; return false;
		}
		if(this.contrasena.value === ''){
			this.errorMessage = "Ingrese una contraseña"; return false;
    }
    
    this.alerta.presentLoading('Ingresando al sistema...',1,0);
    this.login(this.usuario.value, this.contrasena.value);
	}
}
