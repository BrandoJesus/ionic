import { Component, ViewChild } from '@angular/core';
import { NavController,Navbar  ,NavParams, ModalController, DateTime, Refresher } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import {ClientePage} from '../cliente/cliente';
import {SelectProductoPage} from '../select-producto/select-producto';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { LoginPage } from '../login/login';
import { AlertasProvider } from '../../providers/alertas/alertas';
import { VentaPage } from '../venta/venta';
import { ToastProvider } from '../../providers/alertas/toast'

@Component({
  selector: 'page-edit-venta',
  templateUrl: 'edit-venta.html',
})
export class EditVentaPage {

  errorMessage: string = '';
  successMessage: string = '';

  idp: any;
  idc: any;
  tipo: any;
  id_clientes: any;
  usuario: any;
  cabecera: any;
  cliente: any;
  detalles: any;
  detalles2: any;
  producto: any;
  index: any;
  isActualizar: any;
  posicion: any;
  id: any;
  nro_pedido: any;
  items: any;
  productos: any;
  config: any = [];
  lat: any;
  lon: any;
  id_vendedor: any;
  desc_pago: string;
  nombreUsuario: any;
  igv1: any;
  listaprecio: any;
  opcion: any;

  constructor(public navCtrl: NavController, public toast: ToastProvider, public modalCtrl: ModalController, 
    public navParams: NavParams, public storage: Storage, public alerta: AlertasProvider, 
    public geolocation: Geolocation) {

    this.storage = storage;
    this.cabecera = [];
    this.cliente = [];    
    this.detalles = [];
    this.listaprecio = '';
    this.opcion = 1;

    this.id_vendedor = this.navParams.get('id_vendedor');
    this.index = this.navParams.get('index');
    this.posicion = this.navParams.get('posicion');
    // console.log('this.index ', this.index);
    // console.log('this.id_vendedor ', this.id_vendedor);
    
    //this.isNetwork();         
  }  

  ionViewCanEnter(){
  }

  isNetwork() {
    if(!navigator.onLine && this.index == '-1' ){
      this.toast.presentToast('No tienes una conexión a Intenet');
    } 
  }  

  iniciarVenta() {
    this.storage.get('configuracion').then((val)=>{
      this.config = [];
      this.config = val;
      // console.log('this.config ', this.config);
      this.cabecera.serie = this.config[0].serie;
      this.igv1 = this.config[0].igv;
    });

    this.storage.get('usu_regi').then((val)=>{
      this.cabecera.usu_regi = val;
    });

    this.nro_pedido = this.navParams.get('nro_pedido');    
    if(this.nro_pedido)this.cabecera.nro_pedido = this.nro_pedido;
    
    if(this.index >= 0){
      this.storage.get('ventas').then((val)=>{
        this.items = [];
        if(val){
          this.items = val;
          this.cabecera = this.buscarVenta(this.nro_pedido,this.items);
          console.log('cabecera ', this.cabecera);
          if(this.cabecera.forma_pago == '2'){
            this.desc_pago = 'CRÉDITO';
  
          } else if(this.cabecera.forma_pago == '1'){
            this.desc_pago = 'CONTADO';
          }
          //this.cabecera.fecha = this.ordenarfecha(this.cabecera.fecha);
          //this.cabecera.fechadesp = this.ordenarfecha(this.cabecera.fechadesp);
        }
      });

      this.storage.get('detalles_').then((val) => {
        this.items = [];
        this.items = val;
        // console.log('detalles_ ', this.items);

        this.nro_pedido = this.cabecera.nro_pedido;
        this.detalles = this.buscarDventa(this.nro_pedido,this.items);
        console.log('productos ', this.detalles);
      });

      this.storage.get('clientes').then((val)=>{
        this.items = [];
        this.items = val;

        this.id_clientes = this.cabecera.id_clientes;
        this.cliente = this.buscarCliente(this.id_clientes,this.items);
        console.log('cliente ', this.cliente);
      });
    }else{      
      const fecha =  new Date();
      let year = fecha.getFullYear().toString();
      let month = String(fecha.getMonth() + 1); month = fecha.getMonth().toString().length == 1 ? "0"+month: month;
      let day = fecha.getDate().toString().length == 1 ? "0"+fecha.getDate().toString(): fecha.getDate().toString();
      let hour = fecha.getHours().toString().length == 1 ? "0"+fecha.getHours().toString(): fecha.getHours().toString();
      let minute = fecha.getMinutes().toString().length == 1 ? "0"+fecha.getMinutes().toString(): fecha.getMinutes().toString();
      let seconds = fecha.getSeconds().toString().length == 1 ? "0"+fecha.getSeconds().toString(): fecha.getSeconds().toString();   
      
      //let datenow2 = new Date().toJSON().split('T')[0];
      let datenow =  year + "-" + month + "-"  + day;
      let datenow2 =  year + "-" + month + "-"  + day+ " " + hour + ":" + minute + ":" + seconds;
      
      this.cabecera.id = '';
      //this.cabecera.tipo = '';
      this.cabecera.nro_pedido = '';
      this.cabecera.fecha = datenow;
      this.cabecera.fechadesp = datenow;
      this.cabecera.fch_regi = datenow2;
      this.cabecera.forma_pago = '1';
      this.cabecera.observ = '';
      
      this.cliente.id_clientes = '';
      //this.cabecera.descuento = '0.00';
      this.cabecera.subtotal = '0.00';
      this.cabecera.igv = '0.00';
      this.cabecera.total = '0.00';
      this.cabecera.checked = false;
      
      this.watchLocation();
      console.log('cabecera ', this.cabecera);
      
    }
  }
  
  @ViewChild(Navbar) navBar: Navbar;
  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      // console.log('regresar', e);
      let alert = this.alerta.presentConfirm('ALERTA', '¿Desea regresar a la Lista de pedidos?');  
      alert.onDidDismiss((data) => {       
        if(data){
          this.navCtrl.pop();
        }           
      }); 
    }
  }

  ionViewWillEnter(){
    this.cargarUsuario();
    this.iniciarVenta();  
  }

  buscarVenta(buscar,array){
    var n=-1;
    var valor;
    for (var i = 0; i < array.length; i++) {
        valor = array[i].nro_pedido;
        if (valor == buscar) {
            n = i;
        }
    }
    if(n >= 0)
      return array[n];
    else
      return n;
  }

  ordenarfecha(fecha){
    if(fecha){
      fecha = fecha.substring(8, 10) + '/' +fecha.substring(5, 7) +'/' +fecha.substring(0, 4);
      return fecha;
    }
  }

  buscarCliente(buscar,array){
    var n=-1;
    var valor;
    for (var i = 0; i < array.length; i++) {
        valor = array[i].id_clientes;
        if (valor == buscar) {
            n = i;
        }
    }
    if(n >= 0)
      return array[n];
    else
      return n;
  }

  buscarNroVenta(buscar,buscar1,buscar2,array){
    var n=-1;
    var valor;
    var valor1;
    var valor2;
    for (var i = 0; i < array.length; i++) {
        valor = array[i].nro_pedido;
        valor1 = array[i].serie;
        valor2 = array[i].tipo;
        if (valor == buscar && valor1 == buscar1 && valor2 == buscar2) {
            n = i;
        }
    }
    if(n >= 0)
      return array[n];
    else
      return n;
  }

  buscarDventa(buscar,array){
    var n=-1;
    var valor;
    var array1 = new Array();
    var t=0;
  
    for (var i = 0; i < array.length; i++) {
        valor = array[i].nro_pedido;
        if (valor == buscar ) {
            array1[t] = array[i];
            t++;
        }
    }
    if(t >= 0)
      return array1;
    else
      return n;
  }

  verificarNro(){
    this.storage.get('ventas').then((val)=>{
      this.items = [];
      this.items = val;

      let encontrado = this.buscarNroVenta(this.cabecera.nro_pedido,'001',this.cabecera.tipo,this.items);

      if(encontrado != '-1'){
        let tipo = '';
        this.cabecera.nro_pedido = '';
        if(this.cabecera.tipo == '1') tipo = 'factura';
        else tipo = 'boleta';

        this.alerta.presentLoading('Ya existe el nro de ' + tipo,0,1); return false;
      }

    });
  }

  searchCliente(){
    if(this.cabecera.fecha === ''){
      this.alerta.presentLoading('Ingrese fecha',0,1); return false;
    }

    this.storage.set('cabecera',this.cabecera);
    this.storage.set('cliente',this.cliente);
    this.storage.set('detalles',this.detalles);

    // console.log('cliente ', this.cliente);
    let modalPage = this.modalCtrl.create(ClientePage,{
      opcion:1, id_clientes: this.cliente.id_clientes
    });

    modalPage.onDidDismiss(data => {
      if(data) {
        this.cliente = data;
        // console.log('cliente ', this.cliente);

        if(data.id_detalles == '1') {
          
          this.storage.set('detalles', []);
          this.storage.set('_detalles', []);
          this.detalles = [];
          this.cabecera.subtotal = '0.00';
          this.cabecera.igv = '0.00';
          this.cabecera.total = '0.00';
          // console.log('this detalles modal ', this.detalles);
        } else {
          this.cliente = data;
          // console.log('cliente ', this.cliente);
        }

        if(this.cliente.credito != undefined){
          this.listaprecio = this.cliente.credito;
          this.opcion = 0;
        } else {
          this.listaprecio = this.cliente.contado;
          this.opcion = 1;
        }
        console.log('lista ', this.listaprecio);
      }
    });
    modalPage.present();
  }

  editProduct(item, index) {
    if(this.cabecera.fecha === ''){
      this.alerta.presentLoading('Ingrese fecha',0,1); return false;
    }
    if(this.cliente.id_clientes === ''){
      this.alerta.presentLoading('Ingrese un cliente',0,1); return false;
    }
    if(this.cabecera.forma_pago === ''){
      this.alerta.presentLoading('Ingrese una Forma de Pago',0,1); return false;
    }

    this.detalles2 = item;
    this.cliente.id_clientes = item.id_clientes;
    this.storage.set('cabecera',this.cabecera);
    this.storage.set('cliente',this.cliente);
    this.storage.set('detalles',this.detalles);
    
    console.log('set detalles ', this.detalles);

    if(this.cliente.credito != undefined){ this.listaprecio = this.cliente.credito; } 
    else { this.listaprecio = this.cliente.contado; }

    let modalPage = this.modalCtrl.create(SelectProductoPage,{
      nro_pedido:this.nro_pedido, id_cliente:this.cliente.id_clientes, id_lista: this.listaprecio, 
      tipo:this.cabecera.tipo, id_vendedor: this.id_vendedor, producto: this.detalles2.producto , 
      precio: this.detalles2.precio, cantidad: this.detalles2.cantidad, total: this.detalles2.total, 
      id_productos: this.detalles2.id_productos
    });

    modalPage.onDidDismiss(data => {    
      if(data) {
        console.log('data ', data);
        console.log('item ', item);
        console.log('index ', index);

        // console.log('this.detalles ', this.detalles);
        if(this.detalles.length && this.detalles2.id_productos){      
          this.detalles.splice(index, 1);
          let producto = {
            id_vendedor: data.id_vendedor,
            nro_pedido: data.nro_pedido,
            id_clientes: data.id_clientes,
            id_productos: data.id_productos,
            producto: data.producto,
            precio: data.precio,
            cantidad: data.cantidad,
            total: data.total
          };

          this.detalles.push(producto);
          console.log('detallado ', this.detalles);
          this.storage.set('detalles', this.detalles);
        }
        
        this.storage.get('detalles').then((val) => {
          console.log('detalles get', val);
          
        });

        // if(this.detalles2.id_productos) { this.detalles.splice(index, 1); }        
        // this.detalles.push(data);  
        // console.log('detalles ', this.detalles);
        // this.storage.set('detalles', this.detalles); 

        let totalpedidos = 0 , totalp;
        this.detalles.forEach(element => {
          totalpedidos += Number(element.total);
        });
        console.log('tipo_documento ',this.cliente.tipo_documento);
        
        if(totalpedidos > 0) totalp = totalpedidos; else totalp = '0.00';

        if(this.cliente.tipo_documento == '1'){ //RUC
          let igv = (totalp * parseInt(this.igv1))/100;
          let subtotalp =  Number(parseFloat(totalp)).toFixed(2);
          this.cabecera.subtotal = Number(subtotalp).toFixed(2);
          let total = Number(subtotalp) + igv;
          
          this.cabecera.igv = Number(igv).toFixed(2);
          this.cabecera.total = Number(total).toFixed(2);
        } else {
          let igv = (totalp * parseInt(this.igv1))/100;
          let subtotalp =  Number(parseFloat(totalp) - igv).toFixed(2);
          this.cabecera.subtotal = Number(subtotalp).toFixed(2);
          let total = Number(subtotalp) + igv;
          
          this.cabecera.igv = Number(igv).toFixed(2);
          this.cabecera.total = Number(total).toFixed(2);
        }
      }    
    });
    modalPage.present();
    // this.navCtrl.push(SelectProductoPage,{id:''});
  }

  searchProducto(){
    if(this.cabecera.fecha === ''){
      this.alerta.presentLoading('Ingrese fecha',0,1); return false;
    }
    if(this.cliente.id_clientes === ''){
      this.alerta.presentLoading('Ingrese un cliente',0,1); return false;
    }
    if(this.cabecera.forma_pago === ''){
      this.alerta.presentLoading('Ingrese una Forma de Pago',0,1); return false;
    }

    this.storage.set('cabecera',this.cabecera);
    this.storage.set('cliente',this.cliente);
    this.storage.set('detalles',this.detalles);

    // console.log('credito ', this.cliente.credito);
    // console.log('contado ', this.cliente.contado);
    if(this.cliente.credito != undefined){
      this.listaprecio = this.cliente.credito;
    } else {
      this.listaprecio = this.cliente.contado;
    }
    console.log('lista ', this.listaprecio);

    let modalPage = this.modalCtrl.create(SelectProductoPage,{
      nro_pedido:this.nro_pedido, id_cliente:this.cliente.id_clientes, id_lista: this.listaprecio, 
      tipo:this.cabecera.tipo, id_vendedor: this.id_vendedor
    });

    modalPage.onDidDismiss(data => {    
      if(data) {       
        let totalp = data.total;
        this.detalles.push(data);
        console.log('detalles ', this.detalles);
        this.storage.set('detalles', this.detalles);

        if(totalp > 0) totalp = totalp; else totalp = '0.00';
        if(this.cliente.tipo_documento == '1'){ //RUC
          let igv = (totalp * parseInt(this.igv1))/100;
          let subtotalp =  Number(parseFloat(totalp)).toFixed(2);
          this.cabecera.subtotal = Number(parseFloat(this.cabecera.subtotal) + Number(subtotalp)).toFixed(2);
          let total = Number(subtotalp) + igv;
          
          this.cabecera.igv = Number(parseFloat(this.cabecera.igv) + igv).toFixed(2);
          this.cabecera.total = Number(parseFloat(this.cabecera.total) + total).toFixed(2);

        } else {
          let igv = (totalp * parseInt(this.igv1))/100;
          
          let subtotalp =  Number(parseFloat(totalp) - igv).toFixed(2);
          this.cabecera.subtotal = Number(parseFloat(this.cabecera.subtotal) + Number(subtotalp)).toFixed(2);
          let total = Number(subtotalp) + igv;
          
          this.cabecera.igv = Number(parseFloat(this.cabecera.igv) + igv).toFixed(2);
          this.cabecera.total = Number(parseFloat(this.cabecera.total) + total).toFixed(2);
        }
      }
    });
    modalPage.present();
   // this.navCtrl.push(SelectProductoPage,{id:''});
  }

  cargarUsuario() {
    this.storage.get('usuarios').then((val) => {
      if(val) {
        this.nombreUsuario = val.nombre;
      } 
    });
  }

  watchLocation() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // console.log('geolocation ',data);
      if(data.coords){
        // data can be a set of coordinates, or an error (if an error occurred).
        this.cabecera.lat = data.coords.latitude;
        this.cabecera.lon = data.coords.longitude;
        // console.log('lat '+ this.cabecera.lat + ' , lon ' + this.cabecera.lon);
      } else {
        this.displayLocationInfo(data);  
        /*if(this.cabecera.lat == undefined && this.cabecera.lon == undefined ) {
          setTimeout(() => {
            this.watchLocation();
          }, 60000); 
        }*/           
      }
    });
  }

  displayLocationInfo(data) {
    if(data.code == '1') {
      this.toast.presentToast('Se denego el permiso para la Geolocalización');      
    } else if(data.code == '2') {
      this.toast.presentToast('Habilite el GPS de su dispositivo');      
    } else if(data.code == '3') {
      this.toast.presentToast('Tiempo de espera de Geolocalización agotado');      
    }
  }

  getPosition(){    
    // console.log('lat '+ this.cabecera.lat + ' , lon ' + this.cabecera.lon);
    if(this.cabecera.lat == undefined && this.cabecera.lon == undefined ) {
      var options = {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 0
      };
      
      this.geolocation.getCurrentPosition(options).then((resp) => {
        // console.log('resp ', resp);
        if(resp.coords) {
          this.cabecera.lat = resp.coords.latitude;
          this.cabecera.lon = resp.coords.longitude;
        }
      }, (error) => {
        console.log('error ', error);
        this.displayLocationInfo(error);
        this.cabecera.lat = '';
        this.cabecera.lon = '';
        // console.log('lat '+ this.cabecera.lat + ' , lon ' + this.cabecera.lon);
      });
    }    
  }

  guardar(){
    this.getPosition();

    if(this.cabecera.fecha === ''){
      this.alerta.presentLoading('Ingrese fecha',0,1); return false;
    }
    if(this.cabecera.fechadesp === ''){
      this.alerta.presentLoading('Ingrese fecha de despacho',0,1); return false;
    }
    if(this.cliente.id_clientes === ''){
      this.alerta.presentLoading('Ingrese un cliente',0,1); return false;
    }
    if(!this.detalles.length){
      this.alerta.presentLoading('Ingrese un producto',0,1); return false;
    }
    this.alerta.presentLoading('Guardando Pedido...',1,0);
      
    if(this.cabecera){
      //let nombre_tipo;
      //if(this.cabecera.tipo == 1) nombre_tipo = 'FACTURA'; else nombre_tipo = 'BOLETA';
      //console.log('this.lat: '+this.cabecera.lat + '- this.lon: ' + this.cabecera.lon);

      if(this.nro_pedido)this.cabecera.nro_pedido = this.nro_pedido;          

      if(this.index >= 0){
        this.cabecera = {
          id_vendedor: this.cabecera.id_vendedor,
          id_clientes: this.cabecera.id_clientes,
          id_ptoent: this.cabecera.id_ptoent,
          serie: this.cabecera.serie,
          nro_pedido: this.cabecera.nro_pedido,
          //descuento:this.cabecera.descuento,
          igv: this.cabecera.igv,
          subtotal: this.cabecera.subtotal,
          total: this.cabecera.total, 
          //tipo:this.cabecera.tipo,
          tipo_documento: this.cabecera.tipo_documento,
          fecha: this.cabecera.fecha,
          fechadesp: this.cabecera.fechadesp,
          forma_pago: this.cabecera.forma_pago,
          observ: this.cabecera.observ,
          fch_regi: this.cabecera.fch_regi,
          nombre: this.cabecera.nombre,
          documento:this.cabecera.documento,
          direccion: this.cabecera.direccion,
          usu_regi: this.cabecera.usu_regi,
          lat: this.cabecera.lat,
          lon: this.cabecera.lon,
          checked: this.cabecera.checked
        };
      } else {
        this.cabecera = {
          id_vendedor: this.id_vendedor,
          id_clientes:this.cliente.id_clientes,
          id_ptoent: this.cliente.id_ptoent,
          serie:this.cabecera.serie,
          nro_pedido: this.cabecera.nro_pedido,
          //descuento:this.cabecera.descuento,
          igv:this.cabecera.igv,
          subtotal:this.cabecera.subtotal,
          total:this.cabecera.total, 
          //tipo:this.cabecera.tipo,
          tipo_documento:this.cliente.tipo_documento,
          fecha:this.cabecera.fecha,
          fechadesp: this.cabecera.fechadesp,
          forma_pago: this.cabecera.forma_pago,
          observ: this.cabecera.observ,
          fch_regi:this.cabecera.fch_regi,
          nombre:this.cliente.nombre,
          documento:this.cliente.documento,
          direccion:this.cliente.direccion,
          usu_regi:this.cabecera.usu_regi,
          lat: this.cabecera.lat,
          lon: this.cabecera.lon,
          checked: this.cabecera.checked
        };
      }
      console.log('cabecera ', this.cabecera);
      
      this.storage.get('ventas').then((val)=>{
        this.items = [];
        if(val) this.items = val; 

        if(this.index >= 0){
          this.items.splice(this.index, 1, this.cabecera);

        } else {
          this.items.push(this.cabecera);
        }
        this.storage.set("ventas",this.items);
      });

      this.storage.get('detalles_').then((val)=>{
        this.items = [];
        console.log('detalles_', val);
        if(val) this.items = val; else val = this.items;
        console.log('productos existentes ', this.items);

        this.storage.get('detalles').then((val)=>{
          console.log('productos elegidos ', val);
          // console.log('this.cabecera.nro_pedido ', this.cabecera.nro_pedido);
          if(val){
            this.productos = val;
            if(this.index >= 0) {
              this.items = this.items.filter((detalle) => {
                if(detalle.nro_pedido == null || detalle.nro_pedido == undefined) detalle.nro_pedido = '';
                if(this.cabecera.nro_pedido == null || this.cabecera.nro_pedido == undefined) this.cabecera.nro_pedido = '';
                this.isActualizar = detalle.nro_pedido.toLowerCase().indexOf(this.cabecera.nro_pedido.toLowerCase()) > -1 ;
                return !this.isActualizar;
              });
              // console.log('isActualizar ', this.isActualizar);
            }

            for (let i in this.productos) {
              // val[i].subtotal = parseFloat(val[i].precio) * parseInt(val[i].precio);
              this.items.push(val[i]);
            }
            this.storage.set("detalles_",this.items);
            console.log('detalles productos', this.items);
          }
        });
      }); 

      if(this.index >= 0 ) {
        this.alerta.presentLoadingClose();
        this.alerta.presentLoading('Pedido actualizado correctamente',0,1);

      } else {
        this.alerta.presentLoadingClose();
        this.alerta.presentLoading('Pedido guardado correctamente',0,1);
      }               

      this.navCtrl.pop();
      this.navCtrl.setRoot(VentaPage);
        
    }else{
      this.alerta.presentLoadingClose();
      this.alerta.presentLoading('No se pudo guardar el Pedido',0,1);
    }
  }

  borrarProducto( idx:number, detalle: any ){
    console.log('BORRAR ' );
    // console.log('idx ', idx);
    // console.log('eliminado ', detalle);

    if(this.detalles.length){      
      this.detalles.splice( idx, 1 );
      this.storage.set('detalles', this.detalles);
      // console.log('this.detalles ', this.detalles);
    }

    this.storage.get('detalles').then((val)=>{
      console.log('detalles', val);
      if(val) {
        let totalpedidos = 0 , totalp;
        val.forEach(element => {
          totalpedidos += Number(element.total);
          // console.log('total ', element.total);
          // console.log('element ', element);
        });
        // console.log('totalp ', totalpedidos);
        //let descuentop = data.descuento;
        //this.detalles.push(val);
        //this.storage.set('detalles', this.detalles);

        if(totalpedidos > 0) totalp = totalpedidos; else totalp = '0.00';
        //if(descuentop > 0) descuentop = descuentop; else descuentop = '0.00';
        
        if(this.cliente.tipo_documento == '1'){ //RUC
          let igv = (totalp * parseInt(this.igv1))/100;
          let subtotalp =  Number(parseFloat(totalp)).toFixed(2);
          this.cabecera.subtotal = Number(subtotalp).toFixed(2);
          let total = Number(subtotalp) + igv;
          
          this.cabecera.igv = Number(igv).toFixed(2);
          this.cabecera.total = Number(total).toFixed(2);
        } else {
          let igv = (totalp * parseInt(this.igv1))/100;
          let subtotalp =  Number(parseFloat(totalp) - igv).toFixed(2);
          this.cabecera.subtotal = Number(subtotalp).toFixed(2);
          let total = Number(subtotalp) + igv;
          
          this.cabecera.igv = Number(igv).toFixed(2);
          this.cabecera.total = Number(total).toFixed(2);
        }
      }
    });
  }

  /*private createMyForm(){
    return this.formBuilder.group({
      id: [''],
      usu_regi: [''],
      id_clientes: ['', Validators.required],
      tipo: ['', Validators.required],
      nro_pedido: ['', Validators.required],
      fecha: ['', Validators.required]
    });
  }*/


}
