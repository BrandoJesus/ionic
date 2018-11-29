import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SelectProductoPage } from '../select-producto/select-producto';

import { AlertasProvider } from '../../providers/alertas/alertas';
import { ToastProvider } from '../../providers/alertas/toast';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'page-producto',
  templateUrl: 'producto.html',
})
export class ProductoPage {
  tipo: any;
  id_clientes: any;
  id_lista: any;
  nro_pedido: any;
  id: any;
  data: any [];
  items: any [];
  opcion: any;
  search: string = '';
  id_productos: string = '';
  cantidad: any;
  disabled: any;
  listaprecio: any;

  errorMessage: string = '';
  successMessage: string = '';
  nombreUsuario: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, 
    public alerta: AlertasProvider,public viewCtrl : ViewController, public toast: ToastProvider) {
    if(navParams.get('opcion'))
      this.opcion = navParams.get('opcion');
    else {
      this.opcion = 0;
      this.data = [];
    }

    this.items = [{
      'estado': '',
      'fch_act': '',
      'fch_regi': '',
      'id_productos': '',
      'nombre': '',
      'precio': '',
      'stock': "0",
      'unidad': "",
      'usu_act': '',
      'usu_regi': ''
    }];
    this.search = '';  
    this.disabled  = false;
    
    this.id = this.navParams.get('id');
    this.nro_pedido = this.navParams.get('nro_pedido');       

    this.id_clientes = this.navParams.get('id_cliente');
    this.id_lista = this.navParams.get('id_lista');
    this.tipo = this.navParams.get('tipo'); 
  }
  
  setFilterItems(ev: any){
    if(this.items.length == 0) this.cargarProductos();
    const search = ev.target.value;
    this.filterItems(search);
  }

  selectProducto(id_productos,codigo,nombre,precio){
    /*this.navCtrl.push(SelectProductoPage, {
      idp: id,codigo: codigo,nombre:nombre,precio: precio
    });*/
    this.id_productos = id_productos;
    this.viewCtrl.dismiss({
      idp: id_productos, codigo:codigo, nombre:nombre, precio:precio, nro_pedido:this.nro_pedido, id_clientes:this.id_clientes, tipo:this.tipo
    });
  }

  filterItems(search){
    if(search && search.trim() != ''){
      this.items = this.items.filter((item) => {
        if(item.nombre == null) item.nombre = "";
        if(item.precio == null) item.precio = "";
        if(item.peso == null) item.peso = "";
        if(item.raza == null) item.raza = "";
        return (item.nombre.toLowerCase().indexOf(search.toLowerCase()) > -1 ) || 
               (item.id_productos.toLowerCase().indexOf(search.toLowerCase()) > -1 ) ||
               (item.precio.toLowerCase().indexOf(search.toLowerCase()) > -1 ) ||
               (item.peso.toLowerCase().indexOf(search.toLowerCase()) > -1 ) ||
               (item.raza.toLowerCase().indexOf(search.toLowerCase()) > -1 );
      });
    } else {
      this.cargarProductos();
    }
  }

  cargarProductos(){
    this.storage.get('productos').then((val) => {
    if(val){        
      this.items = [];
      this.items = val;
      if(this.opcion == 1) {
        if(this.id_lista){
          this.storage.get('listaprecio').then((val) => {
            if(val){
              this.listaprecio = val;
              // console.log('listaprecio', this.listaprecio);
              this.items = this.buscarListaPrecio(this.id_lista, this.listaprecio, this.items); 
              // console.log('productos finales', this.items);
            } else {
              this.toast.presentToast("Descargue los productos!!");
            }
          });
        } else {
          this.storage.get('listaprecio').then((val) => {
            // console.log('sin lista');
            this.listaprecio = val;
            // console.log('listaprecio', this.listaprecio);
            
            // this.id_lista = val.listaprecio;
            // this.items = this.buscarListaPrecio(this.id_lista, this.listaprecio, this.items);
          });
        }
      } 
    }
    });
  }
  
  cargarUsuario() {
    this.storage.get('usuarios').then((val) => {
      if(val) { this.nombreUsuario = val.nombre; } 
    });
  }

  buscarProducto(buscar,array){
    var n=-1;
    var valor;
    var array1 = new Array();
    var t=0;
  
    for (var i = 0; i < array.length; i++) {
        valor = array[i].id_productos;
        if (valor == buscar ) {
            // console.log('search prod ', array[i]);
            array1[t] = array[i];
            t++;
        }
    }
    if(t >= 0)
      return array1;
    else
      return array;
  }

  buscarListaPrecio(buscar,array, array2){
    var n=-1;
    var valor; var producto;
    var array1 = new Array();
    var t=0;
  
    for (var i = 0; i < array.length; i++) {
      valor = array[i].id_lista;
      if (valor == buscar ) {
        producto = this.buscarProducto(array[i].id_productos, array2);
        if(producto.length) {
          array1[t] = producto[0];
          array1[t].precio = array[i].precio;
          producto = "";
          t++;
        }
      }
    }
    if(t >= 0)
      return array1;
    else
      return array;
  }

  ionViewWillEnter() {
    this.cargarUsuario();   
    this.cargarProductos();   
  }

  public closeModal(){
    this.viewCtrl.dismiss({ idp: '' });
  }

}
