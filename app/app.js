const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();
const Fuse = require('fuse.js');
const cors = require('cors');
const ejs = require('ejs');
const app = express();
const axios = require('axios');

const port = process.env.PORT || 3000;
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configure PostgreSQL database connection using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

/**
    @param path  {String}
    @param config {RequestInit}
*/

async function query(path, config) {
    const url = process.env.DIRECTUS_URL;
    const token = process.env.DIRECTUS_TOKEN;
    const res = await fetch(`${url}${path}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        ...config
    });
    return await res.json();
}

async function getTerms(id) {
    return query(`/items/terms/${id}`, {
        method: 'GET',
    })
}

async function getPrivacy(id) {
    return query(`/items/privacy/${id}`, {
        method: 'GET',
    })
}

async function getNews() {
    return query(`/items/news`, {
        method: 'GET',
    });
}

app.get('/news', async (req, res) => {
    try {
        const news = await getNews();
        const newsData = news.data;
        res.render('home', { newsData });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/terms&conditions', async (req, res) => {
    try {
        const terms = await getTerms(1);
        res.render('terms&conditions', { terms });
    } catch (error) {
        console.error('Error fetching terms and conditions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/privacy', async (req, res) => {
    try {
        const privacy = await getPrivacy(1);
        res.render('privacy', { privacy });
    } catch (error) {
        console.error('Error fetching privacy terms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/home', async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        console.error('Error fetching home page:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                res.json({ success: true, user });
            } else {
                res.status(401).json({ success: false, error: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, error: 'Login failed' });
    }
});

app.post('/register-user', async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            'INSERT INTO users (firstname, lastname, email, phone, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [firstName, lastName, email, phone, hashedPassword]
        );

        res.status(201).json({ success: true, user: result.rows[0] });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
});

app.post('/register-business', async (req, res) => {
    const { businessName, businessNiche, businessPhone, location, empNo } = req.body;

    try {

        const result = await pool.query(
            'INSERT INTO businesses (businessname, businessniche, businessphone, location, empno) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [businessName, businessNiche, businessPhone, location, empNo]
        );

        res.status(201).json({ success: true, business: result.rows[0] });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
});

app.listen(port, () => {
    console.log(`Hustlerati listening on port ${port}`);
});
