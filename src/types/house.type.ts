export interface IHouse {
  id: string
  label: string
  body: string
  image: string
  location: string
  price: number
  createdAt: Date
  user: {
    _id: string
    username: string
    email: string
    phone: string
    image: string
  }
}
