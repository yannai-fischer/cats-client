import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cat, FosterCare, User} from "../../utils/models";
import {CatService} from "../../services/cat.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminPageComponent implements OnInit {
  pendingUsers: User[];
  users: User[];
  pendingFosterApplications: FosterCare[];
  addCatForm: FormGroup;
  cats: Cat[];
  catIllnesses: string[] = [];

  constructor(
    private catService: CatService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.pendingUsers = [];
    this.users = [];
    this.pendingFosterApplications = [];
    this.cats = [];
    this.addCatForm = this.formBuilder.group({
      name: ['', Validators.required],
      age: ['', Validators.compose([Validators.required, Validators.max(30)])],
      sex: ['', Validators.required],
      dateOfArrival: ['', Validators.required],
      illnesses: [],
      isVaccinated: [false],
      isVetted: [false],
      isNeutered: [false],
      hasWorms: [false]
    });
  }

  ngOnInit(): void {
    this.authService.getUsers().subscribe((users: User[]) => this.users = users);
    this.authService.getPendingUserApplications().subscribe((users: User[]) => this.pendingUsers = users);
    this.authService.getPendingFosterCareApplications().subscribe((applications: FosterCare[]) => this.pendingFosterApplications = applications);
    this.catService.getCats().subscribe((cats: Cat[]) => this.cats = cats);
  }

  approveUser(id: number): void {
    this.authService.approveUser(id).subscribe(() => {
      alert(`המשתמש אושר בהצלחה`);
      this.pendingUsers = this.pendingUsers.filter(user => user.id !== id);
    });
  }

  rejectUser(id: number): void {
    this.authService.rejectUser(id).subscribe(() => {
      alert(`המשתמש נדחה בהצלחה`);
      this.pendingUsers = this.pendingUsers.filter(user => user.id !== id);
    });
  }

  resetPassword(id: number): void {
    this.authService.resetPassword(id).subscribe(() => alert(`סיסמת המשתמש אופסה בהצלחה`));
  }

  approveFosterApplication(id: number): void {
    this.authService.approveFosterCare(id).subscribe(() => {
      alert(`האומנה אושרה בהצלחה`);
      return this.pendingFosterApplications = this.pendingFosterApplications.filter(application => application.id !== id);
    });
  }

  rejectFosterApplication(id: number): void {
    this.authService.rejectFosterCare(id).subscribe(() => {
      alert(`האומנה נדחתה בהצלחה`);
      return this.pendingFosterApplications = this.pendingFosterApplications.filter(application => application.id !== id);
    });
  }

  addCat(): void {
    const newCat: Cat = {...this.addCatForm.value, illnesses: JSON.stringify(this.catIllnesses)} as Cat;
    this.catService.upsertCat(newCat).subscribe((cat: Cat) => {
      alert(` החתול ${cat.name} נוסף בהצלחה`);
      this.router.navigate(['/all-cats']);
    });
  }

  addIllness(): void {
    const illness = this.addCatForm.get('illnesses')?.value;
    if (illness) {
      this.catIllnesses.push(illness);
      this.addCatForm.get('illnesses')?.reset();
    }
  }

  getRelevantCatName(catId: number): string {
    return this.cats.find((cat: Cat) => cat.id == catId)?.name ?? '';
  }

  getRelevantUserFullName(userId: number): string {
    const index: number = this.users.findIndex((user: User) => user.id == userId);
    return `${this.users[index].firstName} ${this.users[index].lastName}`;
  }
}
