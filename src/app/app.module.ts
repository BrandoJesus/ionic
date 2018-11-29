import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule} from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { ClientePage } from '../pages/cliente/cliente';
import { ProductoPage } from '../pages/producto/producto';
import { VentaPage } from '../pages/venta/venta';
import { DescargaPage } from '../pages/descarga/descarga';
import { CargaPage } from '../pages/carga/carga';
import { EditClientePage } from '../pages/edit-cliente/edit-cliente';
import { EditVentaPage } from '../pages/edit-venta/edit-venta';
import { SelectProductoPage } from '../pages/select-producto/select-producto';
import { SelectClientPage } from '../pages/select-client/select-client';
import { ClientePageProspecto } from '../pages/cliente-prospecto/cliente-prospecto';
import { SelectVentaPage } from '../pages/select-venta/select-venta';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertasProvider } from '../providers/alertas/alertas';
import { ToastProvider } from '../providers/alertas/toast';
import { Geolocation } from '@ionic-native/geolocation';

import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ClientePage,
    ProductoPage,
    VentaPage,
    DescargaPage,
    CargaPage,
    EditClientePage,
    EditVentaPage,
    SelectProductoPage,
    SelectClientPage,
    ClientePageProspecto,
    SelectVentaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ClientePage,
    ProductoPage,
    VentaPage,
    DescargaPage,
    CargaPage,
    EditClientePage,
    EditVentaPage,
    SelectProductoPage,
    SelectClientPage,
    ClientePageProspecto,
    SelectVentaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AlertasProvider,
    ToastProvider,
    Geolocation,
  ]
})
export class AppModule {}
