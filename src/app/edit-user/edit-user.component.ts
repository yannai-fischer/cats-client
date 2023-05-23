import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage!: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstName: ['',],
      lastName: ['',],
      address: ['',],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.minLength(8)]]
    });
  }

  onEdit(): void {
    this.authService.editUser(this.signupForm.value).subscribe(() => {
      alert("העריכה בוצעה בהצלחה");
      this.router.navigate(['/all-cats']);
    });
  }
}
