import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from '../Model/task';
import { UrlSegment } from '@angular/router';
import { Sorting } from '../Model/sorting';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';
  constructor() { }

  http = inject(HttpClient);

  getTasks(sorting: Sorting, searchValue:string): Observable<TaskModel[]> {
    const queryParams = new HttpParams()
      .set('_sort', sorting.column)
      .set('_order', sorting.order)
      .set('_search', searchValue);

    return this.http.get<TaskModel[]>(this.apiUrl, { params: queryParams });
  }
  
  addTask(task : TaskModel) : Observable<TaskModel>
  {
    return this.http.post<TaskModel>(this.apiUrl,task)
  }

  updateTask(task : TaskModel): Observable<TaskModel>
  {
    console.log("Entering Update")
    return this.http.put<TaskModel>(`${this.apiUrl}/${task.id}`,task);
  }

  deleteTask(id : number): Observable<void>
  {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
