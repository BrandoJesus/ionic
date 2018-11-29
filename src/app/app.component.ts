import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import { ClientePage } from '../pages/cliente/cliente';
import { ProductoPage } from '../pages/producto/producto';
import { VentaPage } from '../pages/venta/venta';
import { DescargaPage } from '../pages/descarga/descarga';
import { CargaPage } from '../pages/carga/carga';
import { EditClientePage } from '../pages/edit-cliente/edit-cliente';
import { EditVentaPage } from '../pages/edit-venta/edit-venta';
import { SelectProductoPage } from '../pages/select-producto/select-producto';



@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  [x: string]: any;
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any, icono: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage) {
    this.initializeApp();

    this.storage = storage;

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Clientes', component: ClientePage, icono: 'assets/img/icono-cliente.png' },
      { title: 'Productos', component: ProductoPage, icono: 'assets/img/icono-producto.png' },
      { title: 'Pedidos', component: VentaPage, icono: 'assets/img/icono-pedido.png' },
      { title: 'Descargar Datos', component: DescargaPage, icono: 'assets/img/icono-descargar.png' },
      { title: 'Enviar Datos', component: CargaPage, icono: 'assets/img/icono-cargar.png' },
    ];

  }


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();


      this.storage.get('logueado').then((val)=>{
          if(val){
            this.rootPage = VentaPage;
          }else{
            this.rootPage = LoginPage;
          }
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  doLogout(){

    this.storage.remove('logueado');
    this.storage.remove('usu_regi');
    /*this.storage.remove('ventas');
    this.storage.remove('detalles_');
    this.storage.remove('clientes'); 
    this.storage.remove('clireparto');
    this.storage.remove('cliprospecto');    
    this.storage.remove('productos');*/   
    this.nav.setRoot(LoginPage);
  }
}
