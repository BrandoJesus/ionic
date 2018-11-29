import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProductoPage } from '../producto/producto';
import { EditVentaPage } from '../edit-venta/edit-venta';
import { AlertasProvider } from '../../providers/alertas/alertas';
import { ToastProvider } from '../../providers/alertas/toast';


@Component({
  selector: 'page-select-producto',
  templateUrl: 'select-producto.html',
})
export class SelectProductoPage {

  detalles: any;
  cliente: any;
  cabecera: any;
  productos: any;
  errorMessage: string = '';
  successMessage: string = '';
  items: string[];
  disponible: any;

  constructor(public navCtrl: NavController, public toast: ToastProvider, public modalCtrl: ModalController, public navParams: NavParams, public storage: Storage, public viewCtrl : ViewController, public alerta: AlertasProvider) {
    this.items = [];
    this.productos = [];
    this.cabecera = [];
    this.detalles = [];
  }

  ionViewWillEnter(){
    this.productos.nro_pedido = this.navParams.get('nro_pedido');
    this.productos.id_clientes = this.navParams.get('id_cliente');
    this.productos.id_vendedor = this.navParams.get('id_vendedor');
    this.productos.id_lista = this.navParams.get('id_lista');

    if(this.navParams.get('producto')) this.productos.producto = this.navParams.get('producto'); else this.productos.id_productos = '';
    if(this.navParams.get('precio')) this.productos.precio = this.navParams.get('precio'); else this.productos.precio = '';
    if(this.navParams.get('cantidad')) this.productos.cantidad = this.navParams.get('cantidad'); else this.productos.cantidad = '';
    if(this.navParams.get('total')) this.productos.total = this.navParams.get('total'); else this.productos.total = Number(0).toFixed(2);   
    if(this.navParams.get('id_productos')) this.productos.id_productos = this.navParams.get('id_productos');
    
  }

  importeSinDesc(){
    // console.log(this.productos);
    if(this.productos.id_productos) {
            
      if(parseInt(this.productos.cantidad) > 0){
        var precio = parseFloat(this.productos.precio) * parseInt(this.productos.cantidad);
        this.productos.total = Number(precio).toFixed(2);
        return true;
      } else {
        this.productos.total = Number(0).toFixed(2);
        this.toast.presentToast('Ingrese cantidad mayor a cero');  
        return false;
      }
    } else {
      console.log('this.productos.cantidad ', parseInt(this.productos.cantidad));      
      this.productos.total = Number(0).toFixed(2);
    }
  }

  importeConDesc(){       
    if(parseInt(this.productos.cantidad) > 0 && parseFloat(this.productos.descuento) > 0){
        let precio = parseFloat(this.productos.total) - parseFloat(this.productos.descuento);        
        this.productos.total = Number(precio).toFixed(2);      
        this.productos.descuento = Number(this.productos.descuento).toFixed(2);
    }
  };

  searchProducto(){
    let modalPage = this.modalCtrl.create(ProductoPage,{
      opcion:1,id:'', nro_pedido:this.productos.nro_pedido, id_clientes:this.productos.id_clientes, id_lista: this.productos.id_lista
    }); 

    modalPage.onDidDismiss(data => { 
      if(data.idp != ""){   

        this.productos.id_productos = '';
        this.productos = {
          //id: data.id,
          id_vendedor: this.productos.id_vendedor,
          nro_pedido: data.nro_pedido,
          id_clientes: this.productos.id_clientes,
          id_productos: data.idp,
          //codigo: data.codigo,
          producto: data.nombre,
          precio: data.precio,
          cantidad: this.productos.cantidad,
          total: this.productos.total,
        };
        // console.log('this.productos ', this.productos);
      }
    });
    modalPage.present();
  }

  addProducto(){
    let sindescuento, condescuento;
    //console.log('this.productos ', this.productos);
    if(this.productos.id_productos){
      sindescuento = this.importeSinDesc(); 
      //condescuento = this.importeConDesc();
      if(sindescuento ){
        this.viewCtrl.dismiss(this.productos);
      }
    } else {
      this.alerta.presentLoading('Ingrese un producto',0,1); return false;
    }
  }

  public closeModal(){
    this.viewCtrl.dismiss();
  } 
  
}
