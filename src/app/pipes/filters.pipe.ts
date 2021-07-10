import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filters'
})
export class FiltersPipe implements PipeTransform {

  transform(items: any[], filter: any): any[] {
    let result = items;
    if (filter.name) {
      result = items.filter(item => item.name.includes(filter.name));
    }
    return result;
  }

}
