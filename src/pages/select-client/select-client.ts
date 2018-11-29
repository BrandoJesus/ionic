import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

@Component({
  selector: 'page-select-client',
  templateUrl: 'select-client.html',
})
export class SelectClientPage {
  id_cliente: any;
  idptoent: any;
  items:any ;
  opcion: any;
  
  errorMessage: string = '';
  clireparto:any = [];
  documento: string = '';
  nombre: string = '';
  email: string = '';
  clientes:any =[];
  nombreUsuario: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public storage: Storage, public viewCtrl : ViewController) {
    
    if(navParams.get('opcion'))
      this.opcion = navParams.get('opcion');
    else
      this.opcion = 0;
   
    if(navParams.get('id_cliente')) this.id_cliente = navParams.get('id_cliente');
    if(navParams.get('documento')) this.documento = navParams.get('documento');
    if(navParams.get('nombre')) this.nombre = navParams.get('nombre');
    if(navParams.get('email')) this.email = navParams.get('email');
    
    this.items = [];
  }

  clienteReparto() {        
    this.storage.get('clireparto').then((val) => {        
      this.clireparto = val;
      if(this.clireparto.length){        
        this.opcion = 1;
        this.items = this.buscarCliente(this.id_cliente,this.clireparto); 
        if(!this.items.length){
          this.cargarCliente();
        }          
      } else {
        this.cargarCliente();
      }
    }, (error) =>{
      console.log("Ocurrio un error al descargar los clients!", error);
    }); 
  }

  cargarCliente() {
    this.storage.get('clientes').then( (val) => {
      this.clientes = val;
      this.items = this.buscarCliente(this.id_cliente,val); 
      this.opcion = 0;
    });
  }

  selectClientReparto(id_cliente,id_ptoent,direccion,referencia){
    if(id_ptoent) this.idptoent = id_ptoent;  
    this.viewCtrl.dismiss({
      id_cliente: id_cliente, id_ptoent: this.idptoent, direccion: direccion, referencia: referencia
    });    
  }

  selectClient(id_cliente,nombre,direccion,email,vendedor){
    this.idptoent = '';  
    this.viewCtrl.dismiss({
      id_cliente: id_cliente,id_ptoent: this.idptoent, nombre: nombre, direccion: direccion, email: email, vendedor: vendedor
    });    
  }

  buscarCliente(buscar,array){
    var n=-1;
    var valor;
    var array1 = new Array();
    var t=0;
    for (var i = 0; i < array.length; i++) {
        valor = array[i].id_clientes;        
        if (valor == buscar) {
            array1[t] = array[i];
            t++;
        }
    }
    if(t >= 0)
      return array1;
    else
      return n;
  }

  cargarUsuario() {
    this.storage.get('usuarios').then((val) => {
      if(val) {
        this.nombreUsuario = val.nombre;
      } 
    });
  }

  ionViewWillEnter() {
    this.clienteReparto();
    this.cargarUsuario();
  }

  public closeModal(){
    this.viewCtrl.dismiss();
  }
}
