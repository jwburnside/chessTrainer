import { Component } from '@angular/core';
import { Configuration, ConfigurationService } from '../shared';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  private config: Configuration;

  constructor(private configurationService: ConfigurationService) {
    this.configurationService.initialize().then(config => {
      this.config = config;
    });
  }
}
