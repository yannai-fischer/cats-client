import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {CatService} from "../../services/cat.service";
import {AuthService} from "../../services/auth.service";
import {Cat, Ride, User} from "../../utils/models";

@Component({
  selector: 'app-rides',
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.css']
})
export class RidesComponent implements OnInit {
  rides: Ride[] = [];
  rideForm!: FormGroup;
  filteredOptions: Observable<string[]>;
  cats: Cat[] = [];
  user!: User;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private catService: CatService) {
    this.filteredOptions = new Observable<string[]>();
  }

  ngOnInit(): void {
    this.rideForm = this.formBuilder.group({
      catId: ['', Validators.required],
      timeOfDeparture: ['', Validators.required],
      source: ['', [Validators.required, this.validateLocation]],
      destination: ['', [Validators.required, this.validateLocation]]
    });
    this.catService.getCats().subscribe(cats => this.cats = cats);
    this.authService.userObservable$.subscribe(user => this.user = user);
    this.catService.getRides().subscribe((rides: Ride[]) => this.rides = rides);
    this.filteredOptions = this.rideForm.get('catId')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    ) as Observable<string[]>;
  }

  getCats(): void {
    this.catService.getCats().subscribe(cats => this.cats = cats);
  }

  onSubmit() {
    if (this.rideForm.valid) {
      const ride: Ride = this.rideForm.value;
      this.catService.upsertRide(ride).subscribe((ride: Ride) => {
        this.rides.push(ride);
        this.rideForm.reset();
      });
    }
  }

  onJoinRide(ride: Ride) {
    if (!ride.userId && ride.id && this.user.id) {
      this.catService.claimRide(ride.id, this.user.id).subscribe((success: boolean) => {
        if (success) {
          ride.userId = this.user.id ?? -1;
          this.rides[this.rides.findIndex(indexRide => indexRide.id == ride.id)] = ride;
          alert('ההרשמה לטרמפ התבצעה בהצלחה!');
        }
      })
    } else {
      alert('כבר קיים נהג עבור טרמפ זה');
    }
  }

  onDeleteRide(id: number) {
    if (id != -1 && confirm('האם אתה בטוח שברצונך למחוק טרמפ זה?')) {
      this.catService.deleteRide(id).subscribe((response: any) => {
        if (response.success) {
          this.rides = this.rides.filter(ride => ride.id !== id);
        } else {
          alert(response.message);
        }
      });
    }
  }

  getRelevantCatName(catId: number): string {
    return this.cats.find((cat: Cat) => cat.id == catId)?.name ?? '';
  }

  private _filter(value: string): string[] {
    const filterValue: string = value.toLowerCase();
    return this.rides
      .filter(ride => !ride.userId)
      .map(ride => ride.catId.toString())
      .filter(option => option.toLowerCase().includes(filterValue));
  }

  validateLocation(control: { value: string; }): { [s: string]: boolean } | null {
    const hebrewLettersPattern: RegExp = /^[\u0590-\u05fe\s]+[0-9]{1,3}[\u0590-\u05fe\s]+$/;
    if (!hebrewLettersPattern.test(control.value)) {
      return {'invalidLocation': true};
    }
    return null;
  }

}
