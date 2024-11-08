import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';

import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule, MatPaginator, MatSortModule, MatTableModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
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
  totalUsers: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.applySorting());
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
    this.getUsers();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getUsers();
  }

  applySorting(): void {
    const sortField = this.sort.active;
    const sortDirection = this.sort.direction;

    this.filteredUsers.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
    this.filteredUsers = [...this.filteredUsers];
  }
}
