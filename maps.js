require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const fs = require('fs')

const app = express()

app.use(cors())

app.use(express.static(path.join(__dirname, 'dist')))

const maps = [
  { 
    id: 1, 
    name: 'Traffic Map', 
    description: '',
    urlKeyword: 'traffic-map',
    filename: 'kepler.gl.json'
  },
  { 
    id: 2, 
    name: 'Cluster Map', 
    description: '',
    urlKeyword: 'cluster-map',
    filename: 'clusters_kepler.gl.json'
  },
  { 
    id: 3, 
    name: 'Czech Highway Weekly Traffic', 
    description: 'Highway load heatmap based on the total volume of traffic in both directions per toll booth from January 18th to January 25th 2022.',
    urlKeyword: 'czech-highway-weekly-traffic',
    filename: 'czech-highway-weekly-traffic.json'
  },
  { 
    id: 4, 
    name: 'Czech Highway Load Clusters', 
    description: 'The highway road segments are clustered as per their relative traffic intensity timelines. Hence, the three resulting clusters represent patterns across the highway network based on similarities in traffic temporal regime among the segments.',
    urlKeyword: 'czech-highway-load-clusters',
    filename: 'czech-highway-load-clusters.json'
  },
  { 
    id: 5, 
    name: 'Healthcare communities 2021', 
    description: 'Communities of districts in the network of 2021 Healthcare visits.',
    urlKeyword: 'рealthcare-communities-2021',
    filename: 'Healthcare_communities_2021.json'
  },
  { 
    id: 6, 
    name: 'Healthcare communities 2022', 
    description: 'Communities of districts in the network of 2022 Healthcare visits.',
    urlKeyword: 'рealthcare-communities-2022',
    filename: 'Healthcare_communities_2022.json'
  },
]

app.get('/get-maps', (req, res) => {
  return res.status(200).json(maps)
})

app.get('/get-map/:id', (req, res) => {
  const { id = 1 } = req.params

  const folderPath = './data/versions/4/'

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
