import { Component } from '@angular/core';

/**
 * Generated class for the PagesClienteProspectoComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'pages-cliente-prospecto',
  templateUrl: 'pages-cliente-prospecto.html'
})
export class PagesClienteProspectoComponent {

  text: string;

  constructor() {
    console.log('Hello PagesClienteProspectoComponent Component');
    this.text = 'Hello World';
  }

}
