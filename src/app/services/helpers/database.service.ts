import { Injectable } from '@angular/core';
import { Database, ref, get, set, push, remove } from '@angular/fire/database';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private db: Database) {}

  setDatabase = (databasePath: string, data: any, newItem = false) => {
    return new Observable<any>((observer) => {
      let dbRef = ref(this.db, databasePath);
      let newKey: string | null = null;
      if (newItem) {
        dbRef = push(dbRef);
        newKey = dbRef.key;
      }

      set(dbRef, data)
        .then(() => {
          observer.next(newKey);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  };

  getDatabase = (databasePath: string) => {
    return new Observable<any>((observer) => {
      const dbRef = ref(this.db, databasePath);
      get(dbRef)
        .then((snapshot) => {
          observer.next(snapshot.exists() ? snapshot.val() : {});
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  };

  removeDatabaseEndpoint = (databasePath: string) => {
    return new Observable<any>((observer) => {
      remove(ref(this.db, databasePath))
        .then(() => {
          observer.next({});
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  };
}
