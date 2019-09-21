import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PgnLoaderService {
  private DOWNLOAD_DIRECTORY_NAME = 'tempDownloadDirectory';
  private ROOT_DIRECTORY = this.file.applicationStorageDirectory;

  constructor(private file: File) {}

  loadPgnFromAssets(filename: string): ReplaySubject<Array<string>> {
    const obs: ReplaySubject<Array<string>> = new ReplaySubject(1);

    this.file
      .createDir(this.ROOT_DIRECTORY, this.DOWNLOAD_DIRECTORY_NAME, true)
      .then(createDirEntry => {
        this.file
          .copyFile(
            this.file.applicationDirectory + 'www/assets/pgns/',
            filename,
            this.ROOT_DIRECTORY + this.DOWNLOAD_DIRECTORY_NAME,
            filename
          )
          .then(copyEntry => {
            this.file.resolveDirectoryUrl(createDirEntry.toURL()).then(
              directoryEntry => {
                directoryEntry.getFile(
                  filename,
                  { create: true, exclusive: false },
                  fileEntry => {
                    fileEntry.file(
                      file => {
                        const reader = new FileReader();
                        // TODO: Returns a different type when I use an error function in its place.
                        reader.onloadend = function() {
                          const resultString: string = this.result as string;
                          const lines = resultString.split('\n');
                          let gameCount = 0;
                          const loadedGames: Array<string> = [];
                          let doesNextEmptyLineRepresentEndOfPgn = false;

                          for (let i = 0; i < lines.length; i++) {
                            if (loadedGames[gameCount] === undefined) {
                              loadedGames[gameCount] = '';
                              doesNextEmptyLineRepresentEndOfPgn = false;
                            }
                            loadedGames[gameCount] = loadedGames[gameCount].concat(lines[i]).concat('\n');
                            if (lines[i] === '\r') {
                              if (doesNextEmptyLineRepresentEndOfPgn) {
                                gameCount++;
                              } else {
                                doesNextEmptyLineRepresentEndOfPgn = true;
                              }
                            }
                          }
                          obs.next(loadedGames);
                          obs.complete();
                        };
                        reader.readAsText(file);
                      }, err => {
                        obs.error(err);
                        obs.complete();
                      }
                    );
                  }, err => {
                    obs.error(err);
                    obs.complete();
                  }
                );
              }, err => {
                obs.error(err);
                obs.complete();
              }
            );
          }).catch(err => {
              obs.error(err);
              obs.complete();
          });
      }).catch(err => {
          obs.error(err);
          obs.complete();
      });
    return obs;
  }
}
