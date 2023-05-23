import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from "./signup/signup.component";
import {EditUserComponent} from "./edit-user/edit-user.component";
import {CommonModule} from "@angular/common";
import { AllCatsComponent } from './all-cats/all-cats.component';
import { FosterCareComponent } from './foster-care/foster-care.component';
import { FormsModule } from '@angular/forms';
import { AdminPageComponent } from './admin/admin.component';
import { RidesComponent } from './rides/rides.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    EditUserComponent,
    AllCatsComponent,
    FosterCareComponent,
    AdminPageComponent,
    RidesComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
