export interface Dataset {
  id: number;
  name: string;
  description: string;
  status:string;
  creationdate:Date;
  updatedate:Date;
  table_name:string;
}

export interface DatasetSelect {
    count:number;
    results: Dataset[];
}