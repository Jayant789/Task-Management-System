export interface TaskModel {
    id? : number;
    date: string;
    entityName : string;
    taskType: string;
    time : string;
    contactPerson : string
    notes : string;
    status: boolean;
}
