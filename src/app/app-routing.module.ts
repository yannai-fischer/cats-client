import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {EditUserComponent} from "./edit-user/edit-user.component";
import {AllCatsComponent} from "./all-cats/all-cats.component";
import {FosterCareComponent} from "./foster-care/foster-care.component";
import {AdminPageComponent} from "./admin/admin.component";
import {RidesComponent} from "./rides/rides.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'admin', component: AdminPageComponent},
  {path: 'rides', component: RidesComponent},
  {path: 'edit-user', component: EditUserComponent},
  {path: 'all-cats', component: AllCatsComponent},
  {path: 'foster-care-request', component: FosterCareComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
