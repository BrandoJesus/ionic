import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ToastProvider } from '../../providers/alertas/toast';
import { SelectVentaPage } from '../select-venta/select-venta';

@Component({
  selector: 'page-carga',
  templateUrl: 'carga.html',
})
export class CargaPage {
  data:any = [];
  data2:any = [];
  data3: any = [];
  nombreUsuario: any;

  loading: any;
  loading2: any;
 
  ruta: string;

  constructor(public navCtrl: NavController, public toast: ToastProvider,
     public http: Http, public storage: Storage) {

    this.ruta = "https://www.bitnetperu.com/clientes/rintisa/app/";
  }
  ionViewWillEnter() {
		this.cargarUsuario();
	}

  clientes(){  
    this.storage.get('cliprospecto').then((val)=>{
      this.loading = 0;
      // console.log('cliprospecto ', val);
      if(val.length){
        var link = this.ruta+'clientes.php?op=1';
        let options:any = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };

        this.http.post(link,val,options)
        .subscribe(data => {
          this.data.response = data;
          this.toast.presentToast("Clientes enviados correctamente!");     
          this.storage.set('cliprospecto', []);
          
          this.loading = 1;
        }, error => {
          this.loading = 2;
          console.log("Ocurrio un error al cargar el cliente!");
        });
      } else {
        this.loading = 2;
        this.toast.presentToast("No hay clientes prospectos agregados para enviar!");
      }
      
    }); 
  }

  pedido(){
      //this.storage.remove('detalles');  
      this.loading2 = 0;
      this.storage.get('ventas').then((val)=>{
        // console.log('ventas ', val);        
        if(val.length) {  
          this.loading2 = 1;
          this.navCtrl.push(SelectVentaPage, {
            index:'-1',// id_vendedor: this.id_vendedor, nro_pedido: this.nro_pedido
          });
        } else {
          this.loading2 = 2;
          this.toast.presentToast("No hay pedidos agregados para enviar!");
        }
      });

    /*this.storage.get('ventas').then((val)=>{
      if(val) {
        this.loading2 = 0;
        console.log('ventas ',val);
        var link = this.ruta+'ventasdelared.php?op=1';
        let options:any = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
  
        this.http.post(link,val,options)
        .subscribe(data => {
          this.data2.response = data;
          this.storage.set('ventas', []);
          this.loading2 = 1;
  
        }, error => {
          this.loading2 = 2;
          console.log("Ocurrio un error al cargar la cabecera!", error);
        });
      } else {
        this.toast.presentToast('No existen Pedidos realizados');
      }
      
    });
    
    this.storage.get('detalles_').then((val)=>{
      console.log('detalles_', val);
      if(val) {
        this.loading2 = 0;
        var link = this.ruta+'detdelared.php?op=1';
        let options:any = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
  
        this.http.post(link,val,options)
        .subscribe(data => {
          this.data2.response = data;
          this.storage.set('detalles_', []);
          this.loading2 = 1;

        }, error => {
          this.loading2 = 2;
          console.log("Ocurrio un error al cargar el detalle!");
        });
      }      
    });*/
  
  }

  cargarUsuario() {
    this.storage.get('usuarios').then((val) => {
      if(val) {
        this.nombreUsuario = val.nombre;
      } 
    });
  }

}
