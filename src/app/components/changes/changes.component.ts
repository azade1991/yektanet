import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeItem, SortType } from '../model';

@Component({
  selector: 'app-changes',
  templateUrl: './changes.component.html',
  styleUrls: ['./changes.component.scss']
})

export class ChangesComponent implements OnInit {
  changeList: ChangeItem[] = [];
  allItems: ChangeItem[] = [];
  savedItem: any[] = [];
  filter = {
    name: '',
    date: '',
    title: '',
    field: ''
  };
  pageSize = 20;
  page = 1;
  pagesLength = 0;
  loading = false;
  timeout: any;
  errMsg = '';
  sort = '';
  sortType = SortType;
  constructor(private service: UtilService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(query => {
      if (query.page) { this.page = query.page; }
      if (query.name) { this.filter.name = query.name; }
      if (query.title) { this.filter.title = query.title; }
      if (query.field) { this.filter.field = query.field; }
      if (query.date) { this.filter.date = query.date; }
      if (query.sort) { this.sort = query.sort; }
    });
  }

  ngOnInit(): void {
    this.getList();
    this.savedItem = JSON.parse(localStorage.getItem('savedItems') || '[]');
  }
  getList(): void {
    this.loading = true;
    this.service.getList().subscribe(
      res => {
        this.loading = false;
        this.allItems = res;
        this.applyFilter();
      }, err => {
        this.loading = false;
        // todo
      });
  }
  nextPage(): void {
    this.page++;
    this.pageChanged();
  }
  lastPage(): void {
    this.page--;
    this.pageChanged();
  }
  pageChanged() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const queryParams: any = {
      page: this.page
    }
    if (this.filter.name) { queryParams.name = this.filter.name; }
    if (this.filter.title) { queryParams.title = this.filter.title; }
    if (this.filter.field) { queryParams.field = this.filter.field; }
    if (this.filter.date) { queryParams.date = this.filter.date; }
    if (this.sort !== '') { queryParams.sort = this.sort; }
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: queryParams });
  }
  applyFilter(): void {
    this.changeList = [...this.allItems];
    if (this.filter.name) {
      this.changeList = this.changeList.filter((item: ChangeItem) => item.name.toLowerCase().includes(this.filter.name.toLowerCase()));
    }
    if (this.filter.title) {
      this.changeList = this.changeList.filter((item: ChangeItem) => item.title.toLowerCase().includes(this.filter.title.toLowerCase()));
    }
    if (this.filter.field) {
      this.changeList = this.changeList.filter((item: ChangeItem) => item.field.toLowerCase().includes(this.filter.field.toLowerCase()));
    }
    if (this.filter.date && this.errMsg === '') {
      this.changeList = this.service.binarySearch(this.changeList, new Date(this.filter.date));
    }
    if (this.changeList.length < this.pageSize) {
      this.page = 1;
    }
    this.changeList = this.service.sortArray(this.changeList, this.sort);
    this.pageChanged();
    this.pagesLength = Math.ceil(this.changeList.length / this.pageSize);
  }

  filterTable(): void {
    clearTimeout(this.timeout);
    // waiting 8ms considering speed ot type
    const $this = this;
    // tslint:disable-next-line:only-arrow-functions
    this.timeout = setTimeout(function () {
      $this.applyFilter();
    }, 800);
  }
  checkFormat() {
    this.errMsg = '';
    if (this.filter.date.length === 0) {
      this.applyFilter();
      return;
    }
    if (this.filter.date.length < 10) {
      this.errMsg = 'تاریغ نا معتبر است';
    } else {
      // convert to english number
      this.filter.date = this.service.fixNumbers(this.filter.date);
      const date = new Date(this.filter.date);
      if (date.getTime()) {
        this.applyFilter();
      } else {
        this.errMsg = 'تاریغ نا معتبر است';
      }
    }
  }
  toggleInStorage(id: number) {
    const index = this.savedItem.findIndex(el => el === id);
    if (index > -1) {
      this.savedItem.splice(index, 1);
    } else {
      this.savedItem.push(id);
      localStorage.setItem('savedItems', JSON.stringify(this.savedItem));
    }
  }
  isSaved(id: number): boolean {
    const index = this.savedItem.findIndex(el => el === id);
    if (index > -1) {
      return true;
    }
    return false;
  }
  toggleSort(): void {
    if (this.sort === '') {
      this.sort = SortType.ASC;
    } else if (this.sort === SortType.ASC) {
      this.sort = SortType.DESC;
    } else {
      this.sort = SortType.ASC;
    }
    this.changeList = this.service.sortArray(this.changeList, this.sort);
    this.pageChanged();
  }
}
