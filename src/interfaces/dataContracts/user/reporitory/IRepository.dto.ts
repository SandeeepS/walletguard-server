export interface ISaveUser {
  name: string;
  password: string;
  email: string;
  phoneNumber: string;
}


export interface IEmailExistCheck {
  email: string;
}

export interface IGetUserDetails{
    userId:string
}
