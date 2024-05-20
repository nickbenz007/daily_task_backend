export interface IUser {
    name: string,
    email: string,
    password: string
}

export interface IColor {
    name: string,
    id: string,
    code: string
}

export interface IIcon {
    name: string,
    id: string,
    symbol: string
}

export interface ICategory {
    _id: string,
    name: string,
    user: IUser | string,
    isEditable: boolean,
    color: IColor
    icon: IIcon
}

export interface ITasks {
    _id: string,
    name: string,
    categoryId: ICategory | string,
    user: string,
    isCompleted: boolean,
    isEditable: boolean,
    date: string
    createdAt: string,
    updatedAt: string
}