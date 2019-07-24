import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'openings/quiz',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'openings/quiz',
    loadChildren: './openings/quiz/quiz.module#QuizPageModule'
  },
  {
    path: 'preferences',
    loadChildren: './preferences/preferences.module#PreferencesPageModule'
  },
  {
    path: 'about',
    loadChildren: './about/about.module#AboutPageModule'
  },
  {
    path: 'list/:idxcategory/:idxsubcategory',
    loadChildren: './list/list.module#ListPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
