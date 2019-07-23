import { Component } from '@angular/core';
import { Lesson } from '../models/lesson';
import { EndgameDatabaseService, EndgameDatabase, ConfigurationService, Configuration, MiscService } from '../shared';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  private config: Configuration;

  constructor(
    private configurationService: ConfigurationService,
  ) {
    this.configurationService.initialize().then(config => {
      this.config = config;
    });
  }

  ngOnInit() {
    // TODO: Create the lessons with a provider?
    const lesson: Lesson = new Lesson();

    // TODO: We can have bonus goals on Exercises, like, name a famous game that this opening is associated with.
  }
}
