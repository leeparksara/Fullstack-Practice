// import
import { config } from 'dotenv'
import pkg from 'pg'
const { Client } = pkg

import express from 'express'

import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
//Dotenv
config()

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.use(cors())
app.use(express.json())
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Header'), 'Content-Type'
    next()
})

// implement the database

const client = new Client({
    database: process.env.DATABASE,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    user: process.env.USER
})

client.connect(function (err) {
    if (err) throw err

    console.log('Databse Connected')
})

// Testing get
app.get('/', (req, res) => {
    res.json('Hejsan')
})
 
// Get request to get all the created users
app.get('/persons', async (req, res) => {
    try {
        const allPersons = await client.query('SELECT * FROM person ')
        res.json(allPersons.rows)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

// Another way to do post request and create users, by using async with try and catch error
app.post('/persons/submit-form', async (req, res) => {
    const { FirstName, LastName, Address, City } = req.body

    try {
        await client.query(
            'INSERT INTO person (FirstName, LastName, Address, City) VALUES ($1,$2,$3,$4)',

            [FirstName, LastName, Address, City]
        )
        res.sendStatus(201)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

/*
// Post request to create new users
// Using async method without try and catch
app.post('/persons/submit-form', async (req, res) => {
    const { FirstName, LastName, Address, City } = req.body
    const values = [FirstName, LastName, Address, City]
    await client.query(
        'INSERT INTO person(FirstName, LastName, Address, City ) VALUES ($1,$2,$3,$4)',
        values
    )

    res.sendStatus(201)
})

 */

app.listen(8800, () => {
    console.log('Server is running ')
})
