import { EventListener } from './EventListener'
import { Status, Task } from './Task';
import { TaskCollection } from './TaskCollection';
import { TaskRenderer } from './TaskRenderer';

class Application {

  private readonly eventListener = new EventListener()
  private readonly taskCollection = new TaskCollection()
  private readonly TaskRenderer = new TaskRenderer(
    document.getElementById('todoList') as HTMLElement,
    document.getElementById('doingList') as HTMLElement,
    document.getElementById('doneList') as HTMLElement,
  )

  start() {
    const createForm = document.getElementById('createForm') as HTMLElement

    this.eventListener.add('submit-handler', 'submit', createForm, this.handleSubmit)

    this.TaskRenderer.subscribeDragAndDrop(this.handleDropAndDrop)
  }

  private handleDropAndDrop = (el: Element, sibling: Element | null, newStatus: Status) => {

    const taskId = this.TaskRenderer.getId(el)

    if (!taskId) return

    const task = this.taskCollection.find(taskId)

    if (!task) return

    task.update({ status: newStatus })
    this.taskCollection.update(task)

    console.log(sibling)
  }

  private handleSubmit = (e: Event) => {
    e.preventDefault()
    // console.log("submiteed")

    const titleInput = document.getElementById('title') as HTMLInputElement

    if (!titleInput.value) return

    const task = new Task({ title: titleInput.value })
    this.taskCollection.add(task)

    const { deleteButtonEl } = this.TaskRenderer.append(task)

    this.eventListener.add(
      task.id,
      'click',
      deleteButtonEl,
      () => this.handleClickDeleteTask(task),
    )

    titleInput.value = ''
  }

  private handleClickDeleteTask = (task: Task) => {
    if (!window.confirm(`「${task.title}」を削除してよろしいですか？`)) return

    this.eventListener.remove(task.id)
    this.taskCollection.delete(task)
    console.log(this.taskCollection)
    this.TaskRenderer.remove(task)
  }
}

// htmlがすべてロードしてからjsを読み込む
window.addEventListener('load', () => {
  const app = new Application()
  app.start()
})
