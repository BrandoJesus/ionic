import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { resolveDep } from '@angular/core/src/view/provider';

@Component({
  selector: 'page-descarga',
  templateUrl: 'descarga.html'
})
export class DescargaPage {
  data:any = [];
  data2:any = [];
  data3:any = [];
  data4:any = [];
  loading: any;
  loading1: any;
  loading2: any;
  loading3: any;
  ruta: string;
  
  errorMessage: string = '';
  clients:any = [];
  clireparto:any = [];
  products:any = [];
	listaprecio:any = [];
	
  id_cliente:string = '';
	body2:any = {};
	nombreUsuario: any;
	cliprospecto: any;

  constructor(public navCtrl: NavController, public http: Http, public storage: Storage) {	  
    this.storage = storage;
    this.ruta = "https://www.bitnetperu.com/clientes/rintisa/app/";
	}
	ionViewWillEnter() {
		this.cargarUsuario();
	}

  clientes(){
  	this.loading = 0;
  	var link = this.ruta+'clientes.php';
		var link2 = this.ruta + 'clireparto.php';	
		let options:any = {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded', }
		};
			
		this.storage.get('usuarios').then((val) => {
			if(val) {
				const body = { vendedor: val.vendedor};

				this.http.post(link, body, options)
				.subscribe(data => {
					this.data.response = JSON.parse(data['_body']);		
					console.log('this.data2 ', this.data);
					this.clients = JSON.parse(data['_body']);
					if(this.clients.length) {
						console.log('clients ', this.clients );

						this.clients = this.clients.sort((a: any, b: any) => {
							if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) {
								return -1;
							} else if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) {
								return 1;
							} else {
								return 0;
							}
						});

						this.cliprospecto = [];	
						this.storage.set('clientes',this.clients);
						this.storage.set('cliprospecto', this.cliprospecto);
						this.loading = 1;									
					} else {
						this.loading = 2;
						this.errorMessage = "No hay clientes";
					}      
				}, error => {
					this.loading = 2;
					console.log("Ocurrio un error al descargar los clients!", error);
				});

				this.http.post(link2, body, options)
				.subscribe(data => {	
					this.data.response = JSON.parse(data['_body']);		
					console.log('this.data ', this.data);	
				this.clireparto = JSON.parse(data['_body']);
				console.log('this.clireparto : ', this.clireparto);
					if(this.clireparto.length){
						this.storage.set('clireparto',this.clireparto);
						this.loading = 1;
					} else {
						this.loading = 2;					
						this.errorMessage = "No hay reparto de clientes";
					}
				}, error => {
					this.loading = 2;
					console.log("Ocurrio un error al descargar los clients!", error);
				});
			} else {
				console.log("Ocurrio un error al descargar los clients!");
			}
		});		
	}
	cargarUsuario() {
    this.storage.get('usuarios').then((val) => {
      if(val) {
        this.nombreUsuario = val.nombre;
      } 
    });
  }

  productos(){
  	this.loading2 = 0;
		var link = this.ruta+'productos.php';
		var link2 = this.ruta+'listaprecio.php';
		let options:any = {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded', }
		};

		this.storage.get('usuarios').then((val) => {
			if(val) {
				const body = { vendedor: val.vendedor};

				this.http.post(link, body, options)
				.subscribe(data => {
					//console.log('data ', data);
					this.data2.response = JSON.parse(data['_body']);		
					console.log('this.data2 prod ', this.data2);
					this.products = JSON.parse(data['_body']);
					if(this.products.length) {
						console.log('products ', this.products );

						this.products = this.products.sort((a: any, b: any) => {
							if(a.nombre == null || a.nombre == undefined) a.nombre = '';
							if(b.nombre == null || b.nombre == undefined) b.nombre = '';

							if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) {
								return -1;
							} else if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) {
								return 1;
							} else {
								return 0;
							}
						});
						this.storage.set('productos', this.products);
						this.loading2 = 1;							
					} else {
						this.loading2 = 2;
						this.errorMessage = "No hay productos";
					}      
				}, error => {
					this.loading2 = 2;
					console.log("Ocurrio un error al descargar los productos!", error);
				});

				console.log(' val.vendedor ',  val.vendedor);
				
				this.http.post(link2, body, options)
				.subscribe(data => {
					// console.log('data ', data);
					this.data2.response = JSON.parse(data['_body']);		
					// console.log('this.data2 lista ', this.data2);
					this.listaprecio = JSON.parse(data['_body']);		
					console.log('listaprecio ', this.listaprecio);

					if(this.listaprecio.length) {
						// console.log('listaprecio ', this.listaprecio );					

						this.storage.set('listaprecio', this.listaprecio);
						this.loading2 = 1;							
					} else {
						this.loading2 = 2;
						this.errorMessage = "No hay Lista de precios";
					}      
				}, error => {
					this.loading2 = 2;
					console.log("Ocurrio un error al descargar la Lista de precios!", error);
				});

			} else {
				console.log("Ocurrio un error al descargar los productos!");
			}
		});	
  }

  ventas(){
  	this.loading3 = 0;
		var link = this.ruta+'ventasdelared.php';
		var link1 = this.ruta+'detdelared.php';

		this.http.get(link)
		.subscribe(data => {
			this.data3.response = JSON.parse(data['_body']);		
			this.storage.set('ventas',this.data3.response);
			console.log("this.data3.ventas ", this.data3.response);
			
			this.data3.response = true;
			this.http.get(link1)
			.subscribe(data => {
				this.data4.response = JSON.parse(data['_body']);
				this.storage.set('detalles_',this.data4.response);
				this.loading3 = 1;
			}, error => {
				this.loading3 = 1;
				console.log("Ocurrio un error al descargar la data!", error);
			});

		}, error => {
			this.loading3 = 1;
			console.log("Ocurrio un error al descargar la data!", error);
		});
		}
}
