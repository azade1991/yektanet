import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  url = `assets/data/data.json`;
  constructor(private http: HttpClient) { }

  getList(): Observable<any> {
    let params = new HttpParams();
    // params = params.append("name", 'ali');
    return this.http.get<any>(this.url, { params: params });
  }
  binarySearch(items: any[], value: Date): any {
    const middle = Math.floor(items.length / 2);
    const middlaDate = new Date(items[middle].date);

    if (middlaDate.getDate() === value.getDate()) {
      return items;
    } else if (middlaDate < value && items.length > 1) {
      debugger
      return this.binarySearch(items.splice(middle, Number.MAX_VALUE), value);
    } else if (middlaDate > value && items.length > 1) {
      return this.binarySearch(items.splice(0, middle), value);
    } else {
      return [];
    }

  }

  fixNumbers(str: string): string {
    if (typeof str === 'string') {
      for (let i = 0; i < 10; i++) {
        str = str.replace(this.persianNumbers[i], i.toString()).replace(this.arabicNumbers[i], i.toString());
      }
    }
    return str;
  }
}
