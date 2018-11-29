import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertasProvider } from '../../providers/alertas/alertas';


@Component({
  selector: 'page-edit-cliente',
  templateUrl: 'edit-cliente.html',
})
export class EditClientePage {

  myForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  items: any[];
  cliprospecto: any[];
 
  index: any;
  id_clientes: string;
  vendedor: string;
  estado: string;
  nombre: string;
  tipo_documento: string;
  documento: string;
  direccion: string;
  telefono: string;
  email: string;
  nombreUsuario: any;
  isProspecto: Boolean;
	textoProspecto: string;
	opcion: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public formBuilder: FormBuilder,public alerta: AlertasProvider) {
	this.myForm = this.createMyForm();		
  	//this.index = navParams.get('index');
  	this.storage = storage;
  	this.items = [];
	this.cliprospecto = [];
  }    

  ionViewWillEnter(){
	this.cargarTodoClientes();
	this.cargarUsuario();
  }

  cargarTodoClientes() {	  
	this.index = this.navParams.get('index');
	console.log('index ', this.index);
	this.opcion = this.navParams.get('opcion');
	console.log('opcion ', this.opcion);
	this.storage.get('clientes').then((val)=>{        
		this.items = val;
	});

	this.storage.get('cliprospecto').then((val)=>{
		console.log('val cli pros ', val);
		console.log('cliprospecto ', this.cliprospecto);
		
		if(val ){
			this.cliprospecto = [];				        
			this.cliprospecto = val;
			console.log('cliprospecto ', this.cliprospecto);
		}
	});

	this.isProspecto = this.navParams.get('isProspecto');
	if(this.isProspecto) this.textoProspecto = 'Prospecto';

	if(this.index >= 0){
		this.id_clientes = this.navParams.get('id_clientes');
		this.nombre =  this.navParams.get('nombre');
		this.vendedor =  this.navParams.get('vendedor');
		this.estado =  this.navParams.get('estado');
		this.tipo_documento =  this.navParams.get('tipo_documento');
		this.documento =  this.navParams.get('documento');
		this.direccion =  this.navParams.get('direccion');
		this.telefono =  this.navParams.get('telefono');
		this.email =  this.navParams.get('email');

	} else {
		this.id_clientes = "";
		this.vendedor = "";
		this.estado = "D";
		this.nombre = "";
		this.tipo_documento = "";
		this.documento = "";
		this.direccion = "";
		this.telefono = "";
		this.email = "";
	}	  	  
  }
  
  guardar(){
	var id_;
	var id_1;

	if(this.myForm.value.nombre === ''){
		this.alerta.presentLoading('Ingrese un nombre',0,1); return false;
	}
	if(this.myForm.value.documento === ''){
		this.alerta.presentLoading('Ingrese un documento',0,1); return false;
	}
	/*if(this.myForm.value.direccion === ''){
		this.alerta.presentLoading('Ingrese una dirección',0,1); return false;
	}*/

	if(this.index >= 0){
		this.alerta.presentLoading('Actualizando cliente...',1,0);
		console.log('this.index ', this.index);
		
		this.cliprospecto[this.index]['nombre'] = String(this.myForm.value.nombre).toUpperCase();
		this.cliprospecto[this.index]['tipo_documento'] = this.myForm.value.tipo_documento;
		this.cliprospecto[this.index]['documento'] = this.myForm.value.documento;
		this.cliprospecto[this.index]['direccion'] = String(this.myForm.value.direccion).toUpperCase();
		this.cliprospecto[this.index]['telefono'] = this.myForm.value.telefono;
		this.cliprospecto[this.index]['email'] = String(this.myForm.value.email).toUpperCase();

		if(this.storage.set("cliprospecto",this.cliprospecto)){
			this.alerta.presentLoadingClose();
			this.alerta.presentLoading('Cliente actualizado correctamente',0,1);
			this.navCtrl.pop();
		} else {
			this.alerta.presentLoadingClose();
			this.alerta.presentLoading('No se pudo actualizar el cliente',0,1);
		}
		
	} else {
		//id_ = this.items.length + 1;
		//id_1 = String(id_);
		//this.myForm.value.id_clientes = id_1;	

		this.storage.get('usuarios').then((val) => {
			if(val) {
				this.vendedor = val.vendedor;
				console.log('this.vendedor ', this.vendedor);

				this.myForm.value.id_clientes = this.documento;	 
				this.myForm.value.vendedor = this.vendedor;	   
				this.myForm.value.estado = this.estado;	    
				this.myForm.value.nombre = String(this.nombre).toUpperCase();	
				this.myForm.value.direccion = String(this.direccion).toUpperCase();	
				this.myForm.value.email = this.email;	   
				this.alerta.presentLoading('Guardando cliente...',1,0);

				console.log('this.cliprospecto ', this.cliprospecto);
				
				if(this.cliprospecto.push(this.myForm.value)) {
					this.storage.set("cliprospecto",this.cliprospecto);
					
					console.log('this.cliprospecto ', this.cliprospecto);
					this.alerta.presentLoadingClose();
					this.alerta.presentLoading('Cliente guardado correctamente',0,1);
					this.navCtrl.pop();
				}else{
					this.alerta.presentLoadingClose();
					this.alerta.presentLoading('No se pudo guardar el cliente',0,1);
				}
			}
		});		
	}
  }

  cargarUsuario() {
    this.storage.get('usuarios').then((val) => {
      if(val) {
        this.nombreUsuario = val.nombre;
      } 
    });
  }

  private createMyForm(){
	let emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$";
		
    return this.formBuilder.group({
		id_clientes: [''],
		vendedor: [''],
		estado: [''],
		nombre: ['', [Validators.required]],
		tipo_documento: ['', Validators.required],
		documento: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(11)]],
		direccion: [''],
		telefono: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
		email: ['', [Validators.pattern(emailPattern) ]],
   
    });
  }

}
