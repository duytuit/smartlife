import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from '../../Core/authentication/auth.guard';

const routes: Routes = [

    { path: 'topsecret', component: IndexComponent, canActivate: [AuthGuard] }       

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TopSecretRoutingModule { }