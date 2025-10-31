export interface Dataset {
  dataset_id: number;
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