import { Component, OnInit, ViewChild ,ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-user-list',
    imports: [FormsModule, MatPaginator, MatSortModule, MatTableModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, AfterViewInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'age',
    'address',
  ];

  searchTerm: string = '';
  totalUsers: number =0;
  pageSize: number = 10;
  currentPage: number = 0;
  visibleUsers: any[] = []; // Explicitly typed

  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(private userService: UserService ,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAllUser();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe(() => this.applySorting());
  }

  getAllUser(){
    this.userService.getAllUsers().subscribe((data) =>{
        this.dataSource.data = data.users; // Assign the full data set
        this.visibleUsers = [...this.users];
        this.totalUsers = data.total;
    })
  }

  getUsers(): void {
    this.userService
      .getUsers(this.currentPage, this.pageSize, this.searchTerm)
      .subscribe((data) => {
        this.users = data.users;
        this.filteredUsers = [...this.users];
        this.totalUsers = data.total;
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    //this.getUsers();
    this.dataSource.filter = this.searchTerm.trim().toLowerCase(); // Apply filter

  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updateVisibleUsers();
    console.log('Visible Users:', this.visibleUsers); // Log the updated visible users
  }

  private updateVisibleUsers(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.visibleUsers = this.users.slice(startIndex, endIndex);
    this.cdr.markForCheck();

  }

  applySorting(): void {
    const active = this.sort.active; // The column being sorted
    const direction = this.sort.direction; // The sort direction (asc/desc)

    if (!active || direction === '') {
      // No sorting
      return;
    }

    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      const valueA = a[active];
      const valueB = b[active];

      // Compare values based on the sort direction
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return direction === 'asc' ? comparison : -comparison;
    });
  }
}
