import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'openings/quiz',
    pathMatch: 'full'
  },
  {
    path: 'home',
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
  },
  {
    path: 'position/:idxcategory/:idxsubcategory/:idxposition',
    loadChildren: './position/position.module#PositionPageModule'
  },
  {
    path: 'fen/:fen1/:fen2/:fen3/:fen4/:fen5/:fen6/:fen7/:fen8/:target',
    loadChildren: './position/position.module#PositionPageModule'
  },
  {
    path: 'fen/:fen1/:fen2/:fen3/:fen4/:fen5/:fen6/:fen7/:fen8',
    loadChildren: './position/position.module#PositionPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
