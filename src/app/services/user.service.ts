import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://dummyjson.com/users';

  constructor(private http: HttpClient) {}

  getUsers(
    page: number,
    limit: number,
    searchTerm: string = ''
  ): Observable<any> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', ((page - 1) * limit).toString());

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((data) => {
        if (searchTerm) {
          const filteredUsers = data.users.filter(
            (user: any) =>
              user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
          );
          return { ...data, users: filteredUsers, total: filteredUsers.length };
        }
        return data;
      })
    );
  }
}
