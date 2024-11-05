export interface IFeedbackDocument {
  _id: string
  value: number
  comment: string
  updatedAt: Date
  user: {
    _id: string
    username: string
    email: string
    phone: string
    image: string
  }
  house: {
    _id: string
    label: string
  }
  id:string
}

export interface IFeedback {
  avgStarsValue: number | null
  feedbacks: IFeedbackDocument[]
}
