import { Component,ChangeDetectionStrategy, OnInit, AfterViewInit,ViewChild} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { TaskModel } from '../../Model/task';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../Services/task.service';
import { ToastrService } from 'ngx-toastr';
import { Sorting } from '../../Model/sorting';

@Component({
  selector: 'app-task',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,MatCardModule,
    MatTableModule,
    MatPaginator,
    MatPaginatorModule,
    MatSort,
    MatSortModule,
    MatIconModule,MatButtonToggleModule,
    CommonModule,
    MatCheckboxModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  taskList : TaskModel[]= [];
  editMode: boolean = false;
  task : TaskModel = {
    date: "",
    entityName :  "",
    taskType:  "",
    time :  "",
    contactPerson :  "",
    notes :  "",
    status: true,
  } 
  
  showTaskForm = false;
  onNewTaskClick() {
    this.showTaskForm = true;
  }

  minutes: number[] = Array.from({length: 60}, (_, i) => i + 1);
  hours: number[] = Array.from({length: 12}, (_, i) => i + 1);

  searchValue: string = '';
  sorting: Sorting ={
    column : 'date',
    order: 'desc',
  }

  searchForm = this.fb.nonNullable.group({
    searchValue: '',
  })

  constructor(private _taskService: TaskService, private _toasterService: ToastrService, private fb: FormBuilder){}
  ngOnInit(): void
  {
    this.getTaskList();
  }
  displayedColumns: string[] = ['Date', 'Entity Name', 'Task Type', 'Time', 'Contact Person', 'Notes', 'Status', 'Actions'];
  
  taskTypeList: string[] = ["Meeting","Call", "Video Call"];
  
  toggleSort(clickedColumn: string)
  {
    this.sorting.column = clickedColumn ;
    this.sorting.order = this.sorting.order === 'asc' ? 'desc' : 'asc';
    console.log(this.sorting.column,this.sorting.order);
    this.getTaskList();
  }
  
  getTaskList()
  {
    this._taskService.getTasks(this.sorting, this.searchValue).subscribe((res)=> {
      this.taskList = res;
    })
  }

  onSearchSubmit(): void
  {
    console.log('searchValue', this.searchForm.value.searchValue);
    this.searchValue = this.searchForm.value.searchValue ?? '';
    this.getTaskList();
  }

  onSubmit(form: NgForm):void
  {
    // debugger;
    if(this.editMode)
      {
        console.log(form);
        this._taskService.updateTask(this.task).subscribe((res) => {
        this.getTaskList();
        this.editMode=false;
        form.reset();
        this.showTaskForm = false;
        this._toasterService.success('Task Updated Succesfully','Success')
        });
        
      }
      else
      {
        console.log(form);
        this._taskService.addTask(this.task).subscribe((res) => {
        this.getTaskList();
        form.reset();
        this.showTaskForm = false;
        this._toasterService.success('Task added Succesfully','Success')
        });
      }
    
  }

  onClosePopup(form : NgForm)
  {
    form.reset();
    this.editMode=false;
    this.getTaskList();
    this.showTaskForm = false;
  }

  onEdit(taskdata: TaskModel){
    this.task = taskdata;
    this.editMode =true;
    this.showTaskForm = true;
  }

  onDelete(id : any)
  {
    const isConfirm = confirm(' Are you sure you want to delete this task?')
    if(isConfirm)
      {
        this._taskService.deleteTask(id).subscribe((res)=>{
          this._toasterService.error('Task deleted successfully','Success')
          this.getTaskList();
        });
        
      }
   
  }
}
