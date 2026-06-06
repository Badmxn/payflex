export type PaymentStatus = "success" | "pending" | "failed"
export type PaymentType   = "transfer" | "wallet" | "invoice"

export type Transaction = {
  id:        string
  recipient: string
  email:     string
  amount:    number
  fee:       number
  type:      PaymentType
  status:    PaymentStatus
  note?:     string
  createdAt: string
}

export type PaymentFormData = {
  recipient: string
  email:     string
  amount:    number
  type:      PaymentType
  note?:     string
}