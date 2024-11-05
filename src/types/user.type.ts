export interface IUser {
  id: string
  username: string
  email: string
  phone: string
  image: string
  activated: boolean
  isAdmin: boolean
  createdAt: Date
}
