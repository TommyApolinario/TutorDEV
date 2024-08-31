import { Routes } from '@angular/router';
import { LoginComponent } from './auth/modules/login/login.component';
import { RegisterComponent } from './auth/modules/register/register.component';
import { ForgotPasswordComponent } from './auth/modules/forgot-password/forgot-password.component';
import { TermsConditionsComponent } from './auth/modules/terms-conditions/terms-conditions.component';
import { DashboardComponent } from './shared-components/dashboard/dashboard.component';
import { ModulesComponent } from './student/components/learn/modules/modules.component';
import { PracticeOptionsComponent } from './student/components/practice/practice-options/practice-options.component';
import { PositionsTableComponent } from './student/components/positions/positions-table/positions-table.component';
import { MyClassComponent } from './student/components/classes/my-class/my-class.component';
import { ChatIaComponent } from './student/components/chat/chat-ia/chat-ia.component';
import { TheoryComponent } from './student/components/learn/theory/theory.component';
import { ActivitiesContainerComponent } from './student/components/learn/activities-container/activities-container.component';
import { MyEvaluationsComponent } from './student/components/classes/my-evaluations/my-evaluations.component';
import { OptionsHomeComponent } from './teacher/components/options-home/options-home.component';

import { ListActivitiesComponent } from './teacher/components/activities/list-activities/list-activities.component';
import { ListClassComponent } from './teacher/components/classes/list-class/list-class.component';
import { ListModulesComponent } from './teacher/components/modules/list-modules/list-modules.component';
import { CreateModuleComponent } from './teacher/components/modules/create-module/create-module.component';
import { EditModuleComponent } from './teacher/components/modules/edit-module/edit-module.component';
import { NewActivityContainerComponent } from './teacher/components/activities/new-activity-container/new-activity-container.component';
import { SingleSelectComponent } from './teacher/components/activities/single-select/single-select.component';
import { MultipleSelectComponent } from './teacher/components/activities/multiple-select/multiple-select.component';
import { OrderWordsComponent } from './teacher/components/activities/order-words/order-words.component';
import { CompleteWordComponent } from './teacher/components/activities/complete-word/complete-word.component';
import { TrueOrFalseComponent } from './teacher/components/activities/true-or-false/true-or-false.component';
import { ListVideosHelpComponent } from './teacher/components/help/list-videos-help/list-videos-help.component';
import { ViewVideosHelpComponent } from './teacher/components/help/view-videos-help/view-videos-help.component';
import { UserProfileComponent } from './shared-components/user-profile/user-profile.component';
import { PermissionsGuard } from './shared-components/guards/permissions.guard';
import { PasswordComponent } from './shared-components/password/password.component';
import { ListUsersComponent } from './admin/components/users/list-users/list-users.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'terms-conditions', component: TermsConditionsComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  },
  {
    path: 'student', canActivate:[PermissionsGuard],
    children: [
      {
        path: 'home', component: DashboardComponent,
        children: [
          { path: 'learn/modules', component: ModulesComponent },
          { path: 'practice/options', component: PracticeOptionsComponent },
          { path: 'positions/positions-table', component: PositionsTableComponent },
          {
            path: 'classes',
            children: [
              { path: 'my-class', component: MyClassComponent },
              { path: 'my-evaluations', component: MyEvaluationsComponent },
            ]
          },
          { path: 'chat-ia', component: ChatIaComponent },
          { path: 'help',
            children: [
              { path: 'list-videos-help', component: ListVideosHelpComponent }, //Arreglar esto
              { path: 'view-video', component: ViewVideosHelpComponent }, //Arreglar esto
            ]
          },
          { path: '', redirectTo: 'learn/modules', pathMatch: 'full' },
          { path: 'user/user-profile', component: UserProfileComponent },
          { path: 'user/change-passwrod', component: PasswordComponent },
        ],
      },
      { path: '', redirectTo: '/student/home/learn/modules', pathMatch: 'full' },
      { path: 'home/theory', component: TheoryComponent },
      { path: 'home/activities', component: ActivitiesContainerComponent },
    ]
  },
  {
    path: 'teacher', canActivate:[PermissionsGuard],
    children: [
      {
        path: 'home', component: DashboardComponent,
        children: [
          { path: 'dashboard/options', component: OptionsHomeComponent },
          {
            path: 'modules',
            children: [
              { path: 'list-modules', component: ListModulesComponent },
              { path: 'create-module', component: CreateModuleComponent },
              { path: 'edit-module', component: EditModuleComponent }
            ]
          },
          { path: 'activities',
            children: [
              { path: 'list-activities', component: ListActivitiesComponent },
              { path: 'new-activity', component: NewActivityContainerComponent },
              { path: 'edit-activity-single-selection', component: SingleSelectComponent },
              { path: 'edit-activity-multiple-selection', component: MultipleSelectComponent },
              { path: 'edit-activity-order-word', component: OrderWordsComponent },
              { path: 'edit-activity-true-or-false', component: TrueOrFalseComponent },
              { path: 'edit-activity-complete-word', component: CompleteWordComponent },
            ]
          },
          { path: 'help',
            children: [
              { path: 'list-videos-help', component: ListVideosHelpComponent },
              { path: 'view-video', component: ViewVideosHelpComponent },
            ]
          },
          { path: 'classes/list-classes', component: ListClassComponent },
          { path: 'user/user-profile', component: UserProfileComponent },
          { path: 'user/change-passwrod', component: PasswordComponent },
        ]
      }
    ]
  },
  {
    path: 'admin', canActivate:[PermissionsGuard],
    children: [
      {
        path: 'home', component: DashboardComponent,
        children: [
          { path: 'dashboard/options', component: OptionsHomeComponent },
          {
            path: 'users',
            children: [
              { path: 'list-users', component: ListUsersComponent },
            ]
          },
          { path: 'help',
            children: [
              { path: 'list-videos-help', component: ListVideosHelpComponent },
              { path: 'view-video', component: ViewVideosHelpComponent },
            ]
          },
          { path: 'user/user-profile', component: UserProfileComponent },
          { path: 'user/change-passwrod', component: PasswordComponent },
        ]
      }
    ]
  }

];
