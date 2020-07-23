import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { Dashboard2Component } from './views/dashboard2/dashboard2.component';
import { ReportsComponent } from './views/reports/reports.component';
import { PaymentsComponent } from './views/payments/payments.component';
import { PlciComponent } from './views/plci/plci.component';
import { CoComponent } from './views/co/co.component';
import { MembersLoginComponent } from './views/members-login/members-login.component';
import { MastersComponent } from './views/masters/masters.component';
import { LogoutComponent } from './views/logout/logout.component';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { UsersListComponent } from './views/users-list/users-list.component';
import { PricingListComponent} from './views/pricing-list/pricing-list.component'
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { MembersListComponent } from './views/members-list/members-list.component';
import { InvoiceListComponent } from './views/invoice-list/invoice-list.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { WalletComponent } from './views/wallet/wallet.component';

import { AuthGuard } from './helpers/auth.guard';
import { UpdateRejestrationComponent } from './update-rejestration/update-rejestration.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    // component : Dashboard2Component
  },  
  
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'reset/:id',
    component : ResetPasswordComponent
  },
  {
    path: 'updateRegistration/:id',
    component : UpdateRejestrationComponent
  },
  {
    path: 'logout',
    component: LogoutComponent,

  },
  {
    path: 'checkCo',
    component: MembersLoginComponent,
    data: {
      title: 'Check Certificate'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
     
      {
        path: 'dashboard',
        // loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
        component : Dashboard2Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'master',
        component: MastersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'master/users',
        component: UsersListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'master/pricing',
        component: PricingListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'master/members',
        component: MembersListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'userDashboard',
        component : Dashboard2Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'plci/:id',
        // loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
        component : PlciComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'co/:id',
        // loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
        component : CoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'reports',
        component:ReportsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'payments',
        component: PaymentsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invoices',
        component: InvoiceListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'wallet',
        component: WalletComponent,
        canActivate: [AuthGuard]
      },
      // {
      //   path: 'wallet',
      //   component:WalletComponent
      // },
      {
        path: 'userPayments',
        component: PaymentsComponent,
        canActivate: [AuthGuard]
        
      },
      {
        path: 'userInvoices',
        component: InvoiceListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'userWallet',
        component: WalletComponent,
        canActivate: [AuthGuard]
      },
     
     
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
