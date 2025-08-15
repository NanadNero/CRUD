export interface User {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  IdentityNumber: number;
  birthDate: string;
  status: boolean;
}
export type CurrentView = 'list' | 'add' | 'detail';