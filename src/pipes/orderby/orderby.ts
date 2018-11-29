import { Pipe, PipeTransform } from '@angular/core';
import * as lodash from 'lodash'

/**
 * Generated class for the OrderbyPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'orderby',
})
export class OrderbyPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    console.log(value);
    
    return value.toLowerCase();
  }

  /*transform(array, args){
    console.log('array ', array);
    console.log('args ', args);
    return lodash.sortBy(array, args);
  }*/
}
