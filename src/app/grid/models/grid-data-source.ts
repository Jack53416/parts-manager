import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

export class GridDataSource<T> extends DataSource<T> {
  /** Stream of data that is provided to the table. */
  data!: BehaviorSubject<T[]>;

  constructor(initialData: T[]) {
    super();
    this.data = new BehaviorSubject<T[]>(initialData);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<T[]> {
    return this.data;
  }

  disconnect() {}
}
