import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { OsmosisPage } from './osmosis.page';

const routes: Routes = [
  {
    path: '',
    component: OsmosisPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [OsmosisPage]
})
export class OsmosisPageModule {}
