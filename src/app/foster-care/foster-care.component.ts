import {Component, OnInit} from '@angular/core';
import {Cat, User} from "../../utils/models";
import {AuthService} from "../../services/auth.service";
import {CatService} from "../../services/cat.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-foster-care',
  templateUrl: './foster-care.component.html',
  styleUrls: ['./foster-care.component.css']
})
export class FosterCareComponent implements OnInit {
  cats: Cat[] = [];
  user!: User;
  fosterCareForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private catService: CatService) {
  }

  ngOnInit(): void {
    this.fosterCareForm = this.formBuilder.group({
      catId: ['', Validators.required],
      startDate: ['', Validators.required],
      finishDate: ['', Validators.required]
    }, {validator: this.dateComparisonValidator});
    this.catService.getCats().subscribe(cats => this.cats = cats);
    this.authService.userObservable$.subscribe(user => this.user = user);
  }

  submitForm(): void {
    this.fosterCareForm.valid && this.catService.requestFosterCare({
      ...this.fosterCareForm.value,
      userId: this.user.id
    }).subscribe(() => alert('הבקשה נשלחה בהצלחה!'), error => alert(`קרתה שגיאה: ${error.message}`));
  }

  dateComparisonValidator(formGroup: FormGroup): { dateComparison: boolean } | null {
    const startDate: Date = formGroup.get('startDate')?.value;
    const finishDate: Date = formGroup.get('finishDate')?.value;
    return startDate && finishDate && startDate > finishDate ? {dateComparison: true} : null;
  }
}
