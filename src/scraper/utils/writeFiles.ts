import path from 'path'
import fs from 'node:fs/promises'

// update function to use it globally not just to write scrape data
export async function writeData(filePaths: {
  data: any
  dir: string
  fileName: string
}) {
  const { data, dir, fileName } = filePaths
  const root = process.cwd()

  const route = path.join(root, 'football-stats', dir)

  await fs.mkdir(route, { recursive: true })

  Bun.write(route + fileName, JSON.stringify(data))

  const savedFilePath = path.join(route, fileName)
  console.log('Date saved in:', savedFilePath)
}
