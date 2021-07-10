export interface ChangeItem {
    id: number;
    name: string;
    date: string;
    title: string;
    field: string;
    old_value: string;
    new_value: string;
}
export enum SortType {
    ASC = 'asc', DESC = 'desc'
}