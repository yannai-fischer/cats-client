import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cat, FosterCare, Ride} from '../utils/models';
import queryString from 'query-string';
import {CAT_SERVER_URL} from "../utils/consts";

@Injectable({
  providedIn: 'root'
})
export class CatService {

  constructor(private http: HttpClient) {
  }

  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(`${CAT_SERVER_URL}/getCats`);
  }

  upsertCat(cat: Cat): Observable<Cat> {
    return this.http.post<Cat>(`${CAT_SERVER_URL}/upsertCat?${queryString.stringify(cat)}`, {});
  }

  requestFosterCare(fosterCare:FosterCare): Observable<FosterCare> {
    return this.http.post<FosterCare>(`${CAT_SERVER_URL}/upsertFosterCare?${queryString.stringify(fosterCare)}`, {});
  }

  getRides(): Observable<Ride[]> {
    return this.http.get<Ride[]>(`${CAT_SERVER_URL}/getRides`);
  }

  upsertRide(ride: Ride): Observable<Ride> {
    return this.http.post<Ride>(`${CAT_SERVER_URL}/upsertRide?${queryString.stringify(ride)}`, {});
  }

  claimRide(id:number, userId:number): Observable<boolean> {
    return this.http.post<boolean>(`${CAT_SERVER_URL}/claimRide/${id}/${userId}`, {});
  }

  deleteRide(id:number): Observable<Ride> {
    return this.http.delete<Ride>(`${CAT_SERVER_URL}/deleteRide/${id}`, {});
  }

  adoptCat(id:number): Observable<boolean> {
    return this.http.post<boolean>(`${CAT_SERVER_URL}/adoptCat/${id}`, {});
  }
}
