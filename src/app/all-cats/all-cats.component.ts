import {Component, OnInit} from '@angular/core';
import {Cat} from "../../utils/models";
import {CatService} from "../../services/cat.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-all-cats',
  templateUrl: './all-cats.component.html',
  styleUrls: ['./all-cats.component.css']
})
export class AllCatsComponent implements OnInit {
  cats: Cat[];
  isAdmin: boolean;

  constructor(private catService: CatService, private authService: AuthService) {
    this.cats = [];
    this.isAdmin = false;
  }

  ngOnInit() {
    this.getCats();
    this.authService.userObservable$.subscribe((user) => this.isAdmin = !!user.isAdmin);
  }

  getCats(): void {
    this.catService.getCats().subscribe(cats => this.cats = cats);
  }

  adoptCat(cat: Cat): void {
    this.catService.adoptCat(cat.id ?? -1).subscribe(() => {
      alert(`החתול אומץ בהצלחה`);
      return this.cats = this.cats.filter(c => c !== cat);
    });
  }
}
