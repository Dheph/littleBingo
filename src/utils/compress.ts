const MAX_DIM = 1600
const JPEG_QUALITY = 0.88

export function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()
    reader.onload = () => {
      img.src = reader.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width
        let h = img.height
        if (w > MAX_DIM || h > MAX_DIM) {
          if (w > h) {
            h = (h / w) * MAX_DIM
            w = MAX_DIM
          } else {
            w = (w / h) * MAX_DIM
            h = MAX_DIM
          }
        }
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
      }
    }
    reader.readAsDataURL(file)
  })
}
