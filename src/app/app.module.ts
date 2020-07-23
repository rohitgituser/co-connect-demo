import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SliderModule } from 'angular-image-slider';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';
import { PdfViewerModule } from 'ng2-pdf-viewer';




const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import {HttpClientModule} from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { Dashboard2Component } from './views/dashboard2/dashboard2.component';
import { ReportsComponent } from './views/reports/reports.component';
import { PaymentsComponent } from './views/payments/payments.component';
import { PlciComponent } from './views/plci/plci.component';
import { CoComponent } from './views/co/co.component';
import { GridFilterPipe } from './pipes/grid-filter.pipe';
import { MembersLoginComponent } from './views/members-login/members-login.component';
import { RbacShowDirective } from './directives/RbacShow.directive';
import { MastersComponent } from './views/masters/masters.component';
import { UsersListComponent } from './views/users-list/users-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PricingListComponent } from './views/pricing-list/pricing-list.component';
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { LogoutComponent } from './views/logout/logout.component';
import { ChartJSRoutingModule } from './views/chartjs/chartjs-routing.module';
import { ChartJSComponent } from './views/chartjs/chartjs.component';
import { MembersListComponent } from './views/members-list/members-list.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { InvoiceListComponent } from './views/invoice-list/invoice-list.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { WalletComponent } from './views/wallet/wallet.component';
import { UpdateRejestrationComponent } from './update-rejestration/update-rejestration.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    NgImageFullscreenViewModule,
    ChartsModule,
    SliderModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgbPaginationModule,
    MatStepperModule,
    PdfViewerModule,
    ChartJSRoutingModule,
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    Dashboard2Component,
    ReportsComponent,
    PaymentsComponent,
    // WalletComponent,
    PlciComponent,
    CoComponent,
    GridFilterPipe,
    MembersLoginComponent,
    RbacShowDirective,
    MastersComponent,
    UsersListComponent,
    PricingListComponent,
    UserProfileComponent,
    LogoutComponent,
    ChartJSComponent,
    MembersListComponent,
    SafeUrlPipe,
    InvoiceListComponent,
    ResetPasswordComponent,
    WalletComponent,
    UpdateRejestrationComponent,

  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
