import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Refresher } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

import { EditVentaPage } from '../edit-venta/edit-venta';
import { AlertasProvider } from '../../providers/alertas/alertas';
import { ToastProvider } from '../../providers/alertas/toast';

@Component({
  selector: 'page-select-venta',
  templateUrl: 'select-venta.html'
})
export class SelectVentaPage {
  
  selectedItem: any;
  data: any;
  data2: any;
  items: any;
  itemsDet: any;
  cantidad: any;
  id_vendedor: any;
  nombreUsuario: any;
  nro_pedido: any;
  message: string;
  detalles: any;
  detalles2: any;
  detallesHechos: any;
  detallesConservados: any;
  index : any;
  checked: any;

  pedidos: any;
  pedidos2: any;
  ruta: string;

  constructor(public navCtrl: NavController, public toast: ToastProvider, public navParams: NavParams, 
              public http: Http, private storage: Storage, public alerta: AlertasProvider) {
  		// If we navigated to this page, we will have an item available as a nav param
      this.selectedItem = navParams.get('item');
      this.pedidos = [];
      this.pedidos2 = [];
      this.detalles2 = [];
      this.detallesHechos = [];
      this.detallesConservados = [];
      this.ruta = "https://www.bitnetperu.com/clientes/rintisa/app/";
  }
  
  ionViewDidLoad() {
    //this.update();
  }

  ionViewCanEnter(){   
  }

  ionViewWillEnter(){ 
    this.calcularfecha();
    this.cargarVentas();
    this.cargarUsuario();
    this.comprobarDatos();
    
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
  }

  cargarUsuario() {
    this.storage.get('usuarios').then((val) => {   
      if(val && !this.id_vendedor) {
        this.nombreUsuario = val.nombre;
        this.id_vendedor = val.vendedor;
      } 
    });
  }

  cargarVentas() {
    this.storage.get('ventas').then((val) => { 
      //console.log('pedidos ', val);
      if(val){       
        this.items = [];
        this.items = val;
        this.pedidos2 = val;
        this.cantidad = this.items.length;
        // console.log('this.id_vendedor ', this.id_vendedor);
        
      } else {
        this.cantidad = 0;
      } 
    });

    this.storage.get('detalles_').then((val) => { 
      console.log('detalles ', val);
      if(val){       
        this.detalles = [];
        this.detalles = val;
        this.detalles2 = val;
        // console.log('this.id_vendedor ', this.id_vendedor);
        
      } 
    });
  }

  comprobarDatos(){    
    this.storage.get('clientes').then((val) => {
      if(!val) {
        this.toast.durationToast('Descargue datos de clientes', 4);
      }
    });

    this.storage.get('productos').then((val) => {
      if(!val) {
        this.toast.durationToast('Descargue datos de productos',2);
      }
    });    
  }

  selectCheck(item : any){
    console.log('item ', item);
    if(item.checked == false){
      item.checked = true;
      console.log('item', item.nro_pedido);

      this.pedidos2 = this.pedidos2.filter((detalle) => {
        if(detalle.nro_pedido == null || detalle.nro_pedido == undefined) detalle.nro_pedido = '';
        // if(item.checked  == null || item.checked  == undefined) this.checked = true;
        // console.log('nombre: ' + String(detalle.nombre) + ' ' + String(detalle.checked));

        this.index = (String(detalle.nro_pedido).toLowerCase().indexOf(String(item.nro_pedido ).toLowerCase()) > -1 );
        // console.log('index ', this.index);
        return !this.index;
      });
      this.pedidos.push(item);

      this.storage.get('detalles_').then((val) => { 
        console.log('detalles ', val);
        if(val){       
          this.detalles = [];
          this.detalles = val;
          //this.detalles2 = val;
          console.log('detalles i', this.detalles);
          console.log('detalles2 i', this.detalles2);
          this.detalles2 = this.detalles2.filter((detalle) => {
            if(detalle.nro_pedido == null || detalle.nro_pedido == undefined) detalle.nro_pedido = '';
            // if(this.cabecera.nro_pedido == null || this.cabecera.nro_pedido == undefined) this.cabecera.nro_pedido = '';
            this.index = detalle.nro_pedido.toLowerCase().indexOf(item.nro_pedido.toLowerCase()) > -1 ;
            console.log('index 2', !this.index);
            return !this.index;
          });

          this.detalles = this.detalles.filter((detalle) => {
            if(detalle.nro_pedido == null || detalle.nro_pedido == undefined) detalle.nro_pedido = '';
            // if(this.cabecera.nro_pedido == null || this.cabecera.nro_pedido == undefined) this.cabecera.nro_pedido = '';
            this.index = detalle.nro_pedido.toLowerCase().indexOf(item.nro_pedido.toLowerCase()) > -1 ;
            console.log('index 1', this.index);
            return this.index;
          });
          console.log('detalles', this.detalles);
          console.log('detalles2', this.detalles2);
          if(this.detalles){
            for (let i in this.detalles) {
              this.detallesHechos.push(this.detalles[i]);
              console.log('detalles hechos', this.detallesHechos);
            }
          }
          
          if(this.detalles2) {
            this.detallesConservados = [];
            for (let i in this.detalles2) {
              this.detallesConservados.push(this.detalles2[i]);
              console.log('detalles conserv', this.detallesConservados);
            }
          }
          
          console.log('detalles hechos final', this.detallesHechos);
          console.log('detalles conserv final', this.detallesConservados);
        } 
      });

      // console.log('pedidos hechos', this.pedidos);
      // console.log('pedidos  conservados', this.pedidos2);
    } else {
      console.log('detalles hechos final', this.detallesHechos);
      console.log('detalles conserv final', this.detallesConservados);
      item.checked = false;
      this.pedidos = this.pedidos.filter((detalle) => {
        if(detalle.nro_pedido == null || detalle.nro_pedido == undefined) detalle.nro_pedido = '';
        // if(item.checked  == null || item.checked  == undefined) this.checked = true;
        // console.log('nombre: ' + String(detalle.nombre) + ' ' + String(detalle.checked));
        this.index = (String(detalle.nro_pedido).toLowerCase().indexOf(String(item.nro_pedido).toLowerCase()) > -1 );
        // console.log('index ', !this.index);
        return !this.index;
      });
      this.pedidos2.push(item);
      // console.log('pedidos  conservados', this.pedidos2);
      // console.log('pedidos hechos', this.pedidos);
  
      this.detalles = [];
      // this.detalles = val;
      this.detalles = this.detallesHechos;
      this.detalles2 = this.detallesHechos;
      //this.detalles2 = val;
      console.log('detalles i', this.detalles);
      console.log('detalles2 i', this.detalles2);

      this.detalles2 = this.detalles2.filter((detalle) => {
        if(detalle.nro_pedido == null || detalle.nro_pedido == undefined) detalle.nro_pedido = '';
        // if(this.cabecera.nro_pedido == null || this.cabecera.nro_pedido == undefined) this.cabecera.nro_pedido = '';
        this.index = detalle.nro_pedido.toLowerCase().indexOf(item.nro_pedido.toLowerCase()) > -1 ;
        console.log('index 2', !this.index);
        return !this.index;
      });

      this.detalles = this.detalles.filter((detalle) => {
        if(detalle.nro_pedido == null || detalle.nro_pedido == undefined) detalle.nro_pedido = '';
        // if(this.cabecera.nro_pedido == null || this.cabecera.nro_pedido == undefined) this.cabecera.nro_pedido = '';
        this.index = detalle.nro_pedido.toLowerCase().indexOf(item.nro_pedido.toLowerCase()) > -1 ;
        console.log('index 1', this.index);
        return this.index;
      });
      console.log('detalles2', this.detalles2);
      console.log('detalles', this.detalles);

      if(this.detalles2){
        this.detallesHechos = [];
        for (let i in this.detalles2) {
          this.detallesHechos.push(this.detalles2[i]);
          console.log('detalles hechos', this.detallesHechos);
        }
      }
      
      if(this.detalles) {
        // this.detallesConservados = [];
        for (let i in this.detalles) {
          this.detallesConservados.push(this.detalles[i]);
          console.log('detalles conserv', this.detallesConservados);
        }
      }
      
      // console.log('detalles hechos final', this.detallesHechos);
      // console.log('detalles conserv final', this.detallesConservados);

    }
  }

  enviarPedidos() {
    console.log('enviar pedidos');
    console.log('detalles hechos', this.detallesHechos);
    console.log('detalles conserv', this.detallesConservados);
    console.log('pedidos  conservados', this.pedidos2);
    console.log('pedidos hechos', this.pedidos);

    // this.storage.get('ventas').then((val) => { 
      // console.log('pedidos ', val);

      if(this.pedidos.length && this.detallesHechos.length){ 
        

        var link = this.ruta+'ventasdelared.php?op=1';
        let options:any = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
  
        this.http.post(link, this.pedidos, options)
        .subscribe(data => {
          console.log('data', data);          
          // this.data.response = data;
          if(data.status = 200){
            this.storage.set('ventas', this.pedidos2);
          } else {
            this.toast.presentToast("Ocurrio un error al cargar los pedidos!");
          }
  
        }, error => {
          console.log("Ocurrio un error al cargar los pedidos!", error);
        });


        var link2 = this.ruta+'detdelared.php?op=1';
        this.http.post(link2, this.detallesHechos, options)
        .subscribe(data => {
          console.log('data', data);
          

          // this.data2.response = data;
          if(data.status = 200){
            //this.storage.set('detalles_', this.detallesConservados);
            this.toast.presentToast("Pedidos enviados correctamente!");
            this.update();
          } else {
            this.toast.presentToast("Ocurrio un error al cargar los pedidos detalle!");
          }
  
        }, error => {
          console.log("Ocurrio un error al cargar la pedidos detalle!", error);
        });
          
        // this.items = [];    
        // this.items = val;
      
        // console.log('pedidos  conservados', this.pedidos2);
        // console.log('pedidos hechos', this.pedidos);
        //this.pedidos = [];
        
        //this.cantidad = this.pedidos.length;
        // console.log('this.id_vendedor ', this.id_vendedor);
        
      } else {
        this.toast.presentToast("No ha seleccionado ningun pedido!!");
        //this.cantidad = 0;
      } 
    // });
    
  }

  recargar( refresher:Refresher ){
    setTimeout( () => {
      this.cargarVentas();
      this.detallesConservados = [];
      this.detallesHechos = [];
      refresher.complete();
    },1500)
  }

  @ViewChild(Refresher) refresh: Refresher;
  update(){
    setTimeout( ()=>{
      this.cargarVentas();
      this.detallesConservados = [];
      this.detallesHechos = [];
      this.refresh.complete();
      
    },1500);
  }
}
