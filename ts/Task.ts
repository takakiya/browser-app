import { v4 as uuid } from 'uuid'

// 列挙型はこうした方が良い
export const statusMap = {
  todo: 'TODO',
  doing: 'DOING',
  done: 'DONE',
} as const

export type Status = typeof statusMap[keyof typeof statusMap]
export class Task {

  readonly id
  title
  status

  constructor(properties: { title: string }) {
    this.id = uuid()
    this.title = properties.title
    this.status = statusMap.todo
  }
}
