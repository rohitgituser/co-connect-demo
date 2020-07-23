import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
  name: 'gridFilter'
})
export class GridFilterPipe implements PipeTransform {

  transform(items: unknown, filter: unknown[]): unknown {

    if (!filter) {
      return items;
    }

    if (!Array.isArray(items)) {
      return items;
    }
    if (!filter['fromDate'] && !filter['toDate'] && !filter['companyName']) {
      return items;
    }
    if (!!filter['fromDate'] || !!filter['toDate'] || !!filter['companyName']) {

      if (filter && Array.isArray(items)) {
        let filterKeys = Object.keys(filter);
      
        return items.filter((item) => {
          if (!filter['fromDate'] && !filter['toDate'] ) {
            if (new RegExp(filter['companyName'], 'gi').test(item['companyName'])) return true;
          }
          else {
            // if( !filter['fromDate'] || !filter['toDate']){
            //   return true;
            // }  
                       
            if( moment(item['date']).diff(moment(filter['toDate']))  < 0 && moment(item['date']).diff(moment(filter['fromDate']) ) > 0 ){
              if (new RegExp(filter['companyName'], 'gi').test(item['companyName']) || !filter['companyName']) return true;           
            }
            // if ( filter['fromDate'] && filter['toDate'] && moment(filter['toDate']).diff( moment(item['date']))  < 0 && moment(filter['fromDate']).diff(moment(item['date'])) >= 0 ) {
            //   if (new RegExp(filter['companyName'], 'gi').test(item['companyName']) || !filter['companyName']) return true;           
            //  } 
          }
        });

      }
    }
  }
}



