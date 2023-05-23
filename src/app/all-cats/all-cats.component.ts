import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cat, EditableCat} from "../../utils/models";
import {CatService} from "../../services/cat.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-all-cats',
  templateUrl: './all-cats.component.html',
  styleUrls: ['./all-cats.component.css']
})
export class AllCatsComponent implements OnInit {
  cats: EditableCat[];
  isAdmin: boolean;
  catForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private catService: CatService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cats = [];
    this.isAdmin = false;
    this.catForm = this.formBuilder.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      sex: ['', Validators.required],
      isVaccinated: [false],
      isVetted: [false],
      isNeutered: [false],
      hasWorms: [false],
      illnesses: []
    });
  }

  ngOnInit() {
    this.getCats();
    this.authService.userObservable$.subscribe((user) => this.isAdmin = !!user.isAdmin);
  }

  getCats(): void {
    this.catService.getCats().subscribe(cats => this.cats = cats.map(cat => {
      return {...cat, isEditing: false}
    }));
  }

  editCat(cat: EditableCat): void {
    cat.isEditing = true;
    this.catForm.patchValue({
      name: cat.name,
      age: cat.age,
      sex: cat.sex,
      isVaccinated: cat.isVaccinated,
      isVetted: cat.isVetted,
      isNeutered: cat.isNeutered,
      hasWorms: cat.hasWorms,
      illnesses: cat.illnesses.join(', ')
    });
  }

  saveCat(cat: EditableCat): void {
    if (this.catForm.invalid) {
      return;
    }

    const updatedCat: Cat = {
      ...cat,
      name: this.catForm.value.name,
      age: this.catForm.value.age,
      sex: this.catForm.value.sex,
      dateOfArrival: this.catForm.value.dateOfArrival,
      isVaccinated: this.catForm.value.isVaccinated,
      isVetted: this.catForm.value.isVetted,
      isNeutered: this.catForm.value.isNeutered,
      hasWorms: this.catForm.value.hasWorms,
      illnesses: this.catForm.value.illnesses.split(',').map((illness: string) => illness.trim())
    };

    this.catService.upsertCat({
      ...updatedCat,
      illnesses: JSON.stringify(updatedCat.illnesses)
    } as unknown as Cat).subscribe(() => {
      alert('החתול עודכן בהצלחה');
      cat.isEditing = false;
      this.router.navigate(['/admin']);
    });
  }

  cancelEdit(cat: EditableCat): void {
    cat.isEditing = false;
  }

  adoptCat(cat: Cat): void {
    this.catService.adoptCat(cat.id ?? -1).subscribe(() => {
      alert(`החתול ${cat.name} אומץ בהצלחה`);
      return this.cats = this.cats.filter(c => c !== cat);
    });
  }
}
