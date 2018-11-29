import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Refresher } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { EditVentaPage } from '../edit-venta/edit-venta';
import { AlertasProvider } from '../../providers/alertas/alertas';
import { ToastProvider } from '../../providers/alertas/toast';

@Component({
  selector: 'page-venta',
  templateUrl: 'venta.html'
})
export class VentaPage {
  
  selectedItem: any;
  data: any;
  items: any;
  itemsDet: any;
  cantidad: any;
  id_vendedor: any;
  nombreUsuario: any;
  nro_pedido: any;
  message: string;
  detalles: any;
  index : any;

  constructor(public navCtrl: NavController, public toast: ToastProvider, public navParams: NavParams, 
    private storage: Storage, public alerta: AlertasProvider) {
  		// If we navigated to this page, we will have an item available as a nav param
      this.selectedItem = navParams.get('item');
      
  }
  
  ionViewDidLoad() {
    this.update();
  }

  ionViewCanEnter(){   
  }

  ionViewWillEnter(){ 
    this.calcularfecha();
    this.cargarVentas();
    this.cargarUsuario();
    this.comprobarDatos();
    
    if(!navigator.onLine ){
      this.toast.presentToast('No tienes una conexión a Intenet');
    }  
  }

  addVenta(){
    this.storage.remove('detalles');
    console.log('pedido ', this.nro_pedido);
        
    this.navCtrl.push(EditVentaPage, {
      index:'-1', id_vendedor: this.id_vendedor, nro_pedido: this.nro_pedido
    });
  }

  editVenta(posicion, index,nro_pedido,tipo){
    this.storage.remove('detalles');
    if(nro_pedido) this.nro_pedido = nro_pedido;

    this.navCtrl.push(EditVentaPage, {
      posicion: posicion, index:index, nro_pedido: this.nro_pedido, tipo:tipo, id_vendedor: this.id_vendedor
    });
  }

  borrarVenta( idx:number, item: any ){
    console.log('item ', item);
    
    if(this.items.length){
      this.items.splice( idx, 1 );
      this.storage.set('ventas', this.items);

      this.storage.get('detalles_').then((val)=>{
        if(val){
          this.detalles = []; this.detalles = val;
          console.log('detalles ', this.detalles);

          this.detalles = this.detalles.filter((detalle) => {
            if(detalle.nro_pedido == null || detalle.nro_pedido == undefined) detalle.nro_pedido = '';
            if(item.nro_pedido == null || item.nro_pedido == undefined) item.nro_pedido = '';

            this.index = detalle.nro_pedido.toLowerCase().indexOf(item.nro_pedido.toLowerCase()) > -1 ;
            return !this.index;
          });
  
          console.log('index ', this.index);
          console.log('detalles find', this.detalles);
          if(this.detalles) this.storage.set('detalles_', this.detalles);          
          this.cargarVentas();
        }
      });
    }
  }

  isNetwork() {
    if(!navigator.onLine ){
      this.toast.presentToast('No tienes una conexion a Intenet');
    } 
  } 

  calcularfecha() {
    const fecha =  new Date();
    let year = fecha.getFullYear().toString().length ? fecha.getFullYear().toString().substring(2): fecha.getFullYear().toString();
    let month = String(fecha.getMonth() + 1); month = fecha.getMonth().toString().length == 1 ? "0"+month: month;
    let day = fecha.getDate().toString().length == 1 ? "0"+fecha.getDate().toString(): fecha.getDate().toString();
    let hour = fecha.getHours().toString().length == 1 ? "0"+fecha.getHours().toString(): fecha.getHours().toString();
    let minute = fecha.getMinutes().toString().length == 1 ? "0"+fecha.getMinutes().toString(): fecha.getMinutes().toString();
    let seconds = fecha.getSeconds().toString().length == 1 ? "0"+fecha.getSeconds().toString(): fecha.getSeconds().toString();    

    this.nro_pedido = year + month + day + hour + minute + seconds;
    this.storage.get('usuarios').then((val) => {  
      if(val) {
        this.nro_pedido = String(val.vendedor) + String(this.nro_pedido);
      } 
    });
  }

  cargarUsuario() {
    this.storage.get('usuarios').then((val) => { 
      // console.log('usuarios ', val);     
      //console.log('id_vendedor ', this.id_vendedor);     
      if(val && !this.id_vendedor) {
 
        this.nombreUsuario = val.nombre;
        this.id_vendedor = val.vendedor;
      } 
    });
  }

  cargarVentas() {
    this.storage.get('ventas').then((val) => { 
      if(val){       
        this.items = [];
        this.items = val;
        this.cantidad = this.items.length;
        console.log('ventas ', this.items);
        // console.log('this.id_vendedor ', this.id_vendedor);
        
      } else {
        this.cantidad = 0;
      } 
    });
  }

  comprobarDatos(){    
    this.storage.get('clientes').then((val) => {
      if(!val) {
        this.toast.durationToast('Descargue datos de clientes', 3);
      }
    });

    this.storage.get('productos').then((val) => {
      if(!val) {
        this.toast.durationToast('Descargue datos de productos', 1.5);
      }

    });    
  }

  recargar( refresher:Refresher ){
    setTimeout( () => {
      this.cargarVentas();
      refresher.complete();
    },1500)
  }

  @ViewChild(Refresher) refresh: Refresher;
  update(){
    setTimeout( ()=>{
      console.log('carga de ventas');
      this.cargarVentas();
      this.refresh.complete();
    },1500);
  }
}
