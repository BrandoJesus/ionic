import { Component, Pipe } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, reorderArray  } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { EditClientePage } from '../edit-cliente/edit-cliente';
import { EditVentaPage } from '../edit-venta/edit-venta';
import { SelectClientPage } from '../select-client/select-client';
import { AlertasProvider } from '../../providers/alertas/alertas';
import { ToastProvider } from '../../providers/alertas/toast';
import * as lodash from 'lodash'

/*@Pipe({ name: 'order-by'})
export class OrderByPipe{
  transform(array, args){
    return lodash.sortBy(array, args);
  }
}*/

@Component({
  selector: 'page-cliente-prospecto',
  templateUrl: 'cliente-prospecto.html',
})
export class ClientePageProspecto {
  cliente: any;
  cabecera: any;
  detalles: any;
  data: string[];
  items: any[];
  opcion: any;
  id_clientes: string;
  nombreUsuario: any;
  cantidad: any;
  disabled: any;

  constructor(public navCtrl: NavController, public alerta: AlertasProvider, public toast: ToastProvider, public modalCtrl: ModalController, public navParams: NavParams, private storage: Storage, public viewCtrl : ViewController) 
  {
    if(navParams.get('opcion')) this.opcion = navParams.get('opcion');
    else this.opcion = 0;

    if(navParams.get('id_clientes'))
    this.id_clientes = navParams.get('id_clientes');
    this.disabled = false;
    this.data = [];
    this.cabecera = [];
    this.cliente = [];
    this.items = [{
      'estado': '',
      'fch_act': '',
      'fch_regi': '',
      'id_clientes': '',
      'nombre': '',
      'email': '',
      'documento': '',
      'tipo_documento': '',
      'vendedor': '',
      'listaprecio': '',
      'telefono': "",
      'direccion': "",
      'usu_act': '',
      'usu_regi': ''
    }];
    
  }

  ionViewWillEnter() {
    this.existeCliente();
    this.cargarClientes();
    this.cargarUsuario();   
  }

  existeCliente() {
    if( this.id_clientes != '' && this.id_clientes != undefined && this.id_clientes != null ) {
      let alert = this.alerta.presentConfirm('ALERTA', '¿Si cambia el Cliente se inicializará los pedidos?');        

      alert.onDidDismiss((data) => {        
        if(data){
          this.cliente.id_detalles = '1';
        } else {
          this.viewCtrl.dismiss();
        }           
      });      
    }
  }

  cargarClientes() {
    this.storage.get('cliprospecto').then((val)=>{
      if(val.length){
        this.items = val;
        this.cantidad = val.length;
      } else {
        this.cantidad = 0;
      }
      
    });
  }

  setFilterItems(ev: any){
    if(this.items.length == 0) this.cargarClientes();
    const search = ev.target.value;
    this.filterItems(search);
  }

  filterItems(search){
    if(search && search.trim() != ''){
      this.items = this.items.filter((item) => {
        if(item.nombre == null || item.nombre == undefined) item.nombre = '';
        if(item.id_clientes == null || item.id_clientes == undefined) item.id_clientes = '';
        if(item.documento == null || item.documento == undefined) item.documento = '';
        if(item.email == null || item.email == undefined) item.email = '';
        if(item.direccion == null || item.direccion == undefined) item.direccion = '';
        if(item.telefono == null || item.telefono == undefined) item.telefono = '';

        return (item.nombre.toLowerCase().indexOf(search.toLowerCase()) > -1 )  ||
               (item.id_clientes.toLowerCase().indexOf(search.toLowerCase()) > -1 ) ||
               (item.email.toLowerCase().indexOf(search.toLowerCase()) > -1 )||
               (item.documento.toLowerCase().indexOf(search.toLowerCase()) > -1 )||
               (item.direccion.toLowerCase().indexOf(search.toLowerCase()) > -1 )||
               (item.telefono.toLowerCase().indexOf(search.toLowerCase()) > -1 ) ;
      });
    } else {
      this.cargarClientes();
    }
  }

  cargarUsuario() {
    this.storage.get('usuarios').then((val) => {
      if(val) { this.nombreUsuario = val.nombre; } 
    });
  }

  addCliente(){
    this.navCtrl.push(EditClientePage, {
      index:'-1', isProspecto: true
    });
  }

  editCliente(index,id_clientes,vendedor,nombre,tipo_documento,documento,direccion,telefono,email, estado){
    if(estado == null || estado == undefined) estado = '';
    this.navCtrl.push(EditClientePage, {
      opcion: 1,index: index,isProspecto: true, id_clientes: id_clientes, vendedor: vendedor, nombre: nombre, tipo_documento: tipo_documento, 
      documento:documento,direccion: direccion,telefono: telefono,email: email, estado: estado
    });
  }

  selectCliente(id_clientes,nombre,email,documento,direccion,vendedor,listaprecio, tipo_documento){
    /*this.cliente = {
      id_clientes:id_clientes,
      nombre:nombre,
      documento:documento,
      direccion:direccion
    };
    this.storage.set('cliente',this.cliente);
    this.viewCtrl.dismiss(this.cliente);*/

    let modalPage = this.modalCtrl.create(SelectClientPage, {
      opcion:1, id_cliente:id_clientes, nombre:nombre, documento:documento, email: email, vendedor:vendedor,  listaprecio: listaprecio
    }); 

    modalPage.onDidDismiss(data => {
      if(data){
        
        if(data.id_ptoent != '' && data.id_ptoent != null) { 
          this.cliente = {
            id_clientes: id_clientes,
            id_ptoent: data.id_ptoent,
            nombre: nombre,
            documento: documento,
            tipo_documento: tipo_documento,
            email: email,
            direccion: data.direccion,
            referencia: data.referencia,
            listaprecio: listaprecio,
            //id_detalles: '1'
          }; 
          this.viewCtrl.dismiss(this.cliente);
        } else {
          this.cliente = {
            id_clientes: id_clientes,
            id_ptoent: data.id_ptoent,
            nombre: nombre,
            documento: documento,
            tipo_documento: tipo_documento,
            email: email,
            direccion: direccion,
            listaprecio: listaprecio,
            vendedor: vendedor,
            //id_detalles: '1'
          }; 
          this.viewCtrl.dismiss(this.cliente);
        }
        // console.log(' ** id_clientes ', id_clientes);
        if(this.id_clientes != undefined){
          if(this.id_clientes == id_clientes){
            this.cliente.id_detalles = '0';

            this.toast.presentToast('Escogio el mismo cliente');
          } else if(this.id_clientes != id_clientes){
            this.cliente.id_detalles = '1';
            this.toast.presentToast('Modifico el cliente');
          }
        } 
      }
    });    
    modalPage.present();
  }

  borrarCliente( idx:number, item: any ){
    if(this.items.length){
      this.items.splice( idx, 1 );
      this.storage.set('cliprospecto', this.items);     
      this.cargarClientes();
    }
  }

  public closeModal(){
    this.cliente = {
      id:'',
      nombre:'',
      documento:'',
      direccion:''
    };
    //this.viewCtrl.dismiss(this.cliente);
    this.viewCtrl.dismiss();
  }
}
