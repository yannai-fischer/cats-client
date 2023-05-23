import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Cat, FosterCare, User} from "../utils/models";
import {HttpClient} from "@angular/common/http";
import {CAT_SERVER_URL, DEFAULT_PASSWORD, FICTITIOUS_USER} from "../utils/consts";
import queryString from 'query-string';
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User>;
  public userObservable$: Observable<User>;
  public user!: User;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<User>(FICTITIOUS_USER);
    this.userObservable$ = this.userSubject.asObservable();
    this.userObservable$.subscribe((user: User) => this.user = user);
  }

  login(username: string, password: string): void {
    this.http.get<User>(`${CAT_SERVER_URL}/login/${username}/${password}`, {}).subscribe((user: User) => {
      if (user?.id) {
        this.userSubject.next(user);
        this.router.navigate(['/all-cats']);
      } else {
        alert("שגיאה בהתחברות!");
      }
    });
  }

  signup(user: User): Observable<User> {
    return this.http.post<User>(`${CAT_SERVER_URL}/createUser?${queryString.stringify(user)}`, {});
  }

  editUser(user: any): Observable<User> {
    let userToAdd: any = {};
    Object.keys(user).filter(key => user[key] != '').forEach(relevantKey => userToAdd[relevantKey] = user[relevantKey]);
    return this.http.post<User>(`${CAT_SERVER_URL}/upsertUser?${queryString.stringify({
      ...userToAdd,
      id: this.user.id
    })}`, {});
  }

  resetPassword(id: number) {
    return this.http.post<User>(`${CAT_SERVER_URL}/upsertUser?${queryString.stringify({
      password: DEFAULT_PASSWORD,
      id
    })}`, {});
  }

  logout(): void {
    this.userSubject.next(FICTITIOUS_USER);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${CAT_SERVER_URL}/getUsers`);
  }

  getPendingUserApplications(): Observable<User[]> {
    return this.http.get<User[]>(`${CAT_SERVER_URL}/pendingUserApplications`);
  }

  getPendingFosterCareApplications(): Observable<FosterCare[]> {
    return this.http.get<FosterCare[]>(`${CAT_SERVER_URL}/pendingFosterCareApplications`);
  }

  approveUser(id: number): Observable<boolean> {
    return this.http.post<boolean>(`${CAT_SERVER_URL}/approveUser/${id}`, {});
  }

  rejectUser(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${CAT_SERVER_URL}/deleteUser/${id}`, {});
  }

  approveFosterCare(id: number): Observable<boolean> {
    return this.http.post<boolean>(`${CAT_SERVER_URL}/approveFosterCare/${id}`, {});
  }

  rejectFosterCare(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${CAT_SERVER_URL}/deleteFosterCare/${id}`, {});
  }
}
