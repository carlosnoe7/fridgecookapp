export interface Opinion {
  author: string
  message: string
  likes: Record<string, boolean>
  id: string
}
