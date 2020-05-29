import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MqttSocketService } from './Shareds/Services/mqtt-socket.service';
import { ManagerDeviceMqttComponent } from './Components/manager-device-mqtt/manager-device-mqtt.component';
import { ModalModule } from 'src/lib/modal';
import { ToasterComponent } from './Shareds/toaster/toaster.component';
import { ToasterContainerComponent } from './Shareds/toaster-container/toaster-container.component';
import { FooterComponent } from './Shareds/Views/footer/footer.component';
import { NavbarComponent } from './Shareds/Views/navbar/navbar.component';
import { SidebarComponent } from './Shareds/Views/sidebar/sidebar.component';
import { DashboardComponent } from './Shareds/Views/pages/dashboard/dashboard.component';
import { FormsComponent } from './Shareds/Views/pages/forms/forms.component';
import { MapsComponent } from './Shareds/Views/pages/maps/maps.component';
import { NotificationsComponent } from './Shareds/Views/pages/notifications/notifications.component';
import { TablesComponent } from './Shareds/Views/pages/tables/tables.component';
import { TypographyComponent } from './Shareds/Views/pages/typography/typography.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ToastrModule } from 'ngx-toastr';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { CoreModule } from './Shareds/Core/core.module';
import { LoginComponent } from './Shareds/Views/account/login/login.component';
import { RegisterComponent } from './Shareds/Views/account/register/register.component';
import { AuthCallbackComponent } from './Shareds/Views/account/auth-callback/auth-callback.component';
import { IndexComponent } from './Shareds/Views/top-secret/index/index.component';
import { AuthGuard } from './Shareds/Core/authentication/auth.guard';
import { FakeBackendProvider } from './Shareds/Mocks/fake-backend-interceptor';
import { HomeComponent } from './Shareds/Views/home/home.component';
import { UserHubComponent } from './Components/user-hub/user-hub.component';
import { WelcomeComponent } from './Shareds/Views/account/welcome/welcome.component';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { AuthProvider } from './Shareds/Mocks/AuthenticationInterceptorService ';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingComponent } from './Shareds/Mocks/loading';
import { FilterHubComponent } from './Shareds/filterdrop/filter-hub/filter-hub.component';

@NgModule({
  declarations: [
    AppComponent,
    ManagerDeviceMqttComponent,
    ToasterComponent,
    ToasterContainerComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    DashboardComponent,
    FormsComponent,
    MapsComponent,
    NotificationsComponent,
    TablesComponent,
    TypographyComponent,
    LoginComponent,
    RegisterComponent,
    AuthCallbackComponent,
    IndexComponent,
    HomeComponent,
    UserHubComponent,
    WelcomeComponent,
    LoadingComponent,
    FilterHubComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    HttpClientModule,
    FormsModule,
    CoreModule,
    ModalModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    ToastrModule.forRoot(),
    MalihuScrollbarModule.forRoot(),
    RouterModule.forRoot([
     { path: '', component: WelcomeComponent,pathMatch: 'full' },
     { path: 'home',
     component: HomeComponent,
      canActivate: [AuthGuard],
      children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'form', component: FormsComponent},
      {path: 'tables', component: TablesComponent},
      {path: 'typography', component: TypographyComponent},
      {path: 'maps', component: MapsComponent},
      {path: 'user-hub', component: UserHubComponent},
      {path: 'notifications', component: NotificationsComponent},
      { path: 'manager-device', component: ManagerDeviceMqttComponent }
     ]},
     { path: '**', redirectTo: 'home' }
    ])
  ],
  providers: [
    MqttSocketService,
    FakeBackendProvider,
    AuthProvider
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
