require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const fs = require('fs')
const { readdir } = require('fs').promises;
const { join } = require('path');

const app = express()

app.use(cors())

app.use(express.static(path.join(__dirname, 'dist')))


app.get('/get-maps', async (req, res) => {
  // Перебираем файлы из папки 
  const maps = await getMaps()
  
  return res.status(200).json(maps)
})

app.get('/get-map/:id', async (req, res) => {
  const { id = 1 } = req.params

  const folderPath = './data/'

  const maps = await getMaps()

  const map = maps.find(map => Number(map.id) === Number(id))

  if (!map)
    return res.status(400).json({ message: 'Invalid filename id.' })

  const filePath = path.join(__dirname, folderPath + map.filename)

  const file = fs.existsSync(filePath)

  if (!file)
    return res.status(400).json({ message: 'Invalid filename path.' })

  return res.sendFile(filePath)
})

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// service.js
async function getMaps() {
  try {
    const files = await readdir('./data', { withFileTypes: true })

    // Берем только json файлы

    const filtered = files.filter(file => {
      const [name, ext] = file.name.split('.')
      return ext === 'json'
    })

    const prepared = filtered.map((file, index) => {
      const { name: filename } = file

      const [fullname, ext] = filename.split('.')

      // Heathcare_Visits_in_Czech_Republic__communities__2023
      const [name, type, year] = fullname.split('__')

      const readableName = name.split('_')

      return {
        id: index,
        name: readableName.join(' '),
        description: '',
        type: type,
        year: year,
        urlKeyword: readableName.join('-'),
        filename: filename
      }
    })

    return prepared
  } catch (error) {
    console.error('Ошибка при чтении директории:', error)
    return []
  }
}