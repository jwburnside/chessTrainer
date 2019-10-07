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
    loadChildren: './pages/openings/quiz/quiz.module#QuizPageModule'
  },

  {
    path: 'pages/logical-chess/explorer/:filename',
    loadChildren: './pages/logical-chess/explorer/explorer.module#ExplorerPageModule'
  },
  // {
  //   path: 'vision/square-color',
  //   loadChildren: './vision/square-color/square-color.module#SquareColorPageModule'
  // },
  // {
  //   path: 'vision/osmosis',
  //   loadChildren: './vision/osmosis/osmosis.module#OsmosisPageModule'
  // },
  // {
  //   path: 'preferences',
  //   loadChildren: './preferences/preferences.module#PreferencesPageModule'
  // },
  // {
  //   path: 'about',
  //   loadChildren: './about/about.module#AboutPageModule'
  // },
  // { path: 'traps', loadChildren: './traps/traps.module#TrapsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
