import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangeItem, SortType } from '../components/model';

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
  fixNumbers(str: string): string {
    if (typeof str === 'string') {
      for (let i = 0; i < 10; i++) {
        str = str.replace(this.persianNumbers[i], i.toString()).replace(this.arabicNumbers[i], i.toString());
      }
    }
    return str;
  }
  sortArray(items: ChangeItem[], sort: string): ChangeItem[] {
    items.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      if (sort === SortType.ASC) {
        return aDate.getTime() - bDate.getTime();
      } else {
        return bDate.getTime() - aDate.getTime();
      }
    });
    return items;
  }
  createBST(items: any[]) {
    const bst = new BinarySearchTree();
    for (var i = 0; i < items.length; i++) {
      bst.insert(items[i]);
    }
    return bst;

  }
  findNode(nodes: any, value: any): any {
    debugger
    const rootvalue = new Date(nodes.value.date).getTime();
    if (value === rootvalue) {
      return nodes.list;
    }
    if (value > rootvalue) {
      // go right
      if (nodes.rightChild !== null) {
        return this.findNode(nodes.rightChild, value);
      } else {
        return [];
      }
    } else if (value < rootvalue) {
      //go left
      if (nodes.leftChild !== null) {
        return this.findNode(nodes.leftChild, value);
      } else {
        return [];
      }
    }
  }
  binarySearch(items: ChangeItem[], value: Date) {
    const nodes = this.createBST(items);
    const result = this.findNode(nodes.root, value.getTime());
    return result;
  }
}

class Node {
  value: any;
  leftChild: any;
  rightChild: any;
  list: any[];
  constructor(value: any) {
    this.value = value;
    this.leftChild = null;
    this.rightChild = null;
    this.list = [];
    this.list.push(value);
  };
}

class BinarySearchTree {
  root: any;
  constructor() {
    this.root = null;
  }
  insert(data: any) {
    let newNode = new Node(data);
    if (this.root === null) {
      this.root = newNode;
    }
    else {
      this.insertNode(this.root, newNode);
    };
  };
  insertNode(node: Node, newNode: Node) {
    const neWDate = new Date(newNode.value.date).getTime();
    const date = new Date(node.value.date).getTime();
    if (neWDate <= date) {
      if (node.leftChild === null) {
        node.leftChild = newNode;
        return;
      }
      if (neWDate == date) {
        node.list.push(newNode.value)
        return;
      }
      else {
        this.insertNode(node.leftChild, newNode);
      };
    } else {
      if (node.rightChild === null) {
        node.rightChild = newNode;
        return
      }
      else {
        this.insertNode(node.rightChild, newNode);
      };
    };
  };
}


