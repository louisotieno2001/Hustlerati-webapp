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
const session = require('express-session');
const multer = require('multer');
const pgSession = require('connect-pg-simple')(session);
const port = process.env.PORT || 3000;
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');
const { Buffer } = require('buffer');
const url = process.env.DIRECTUS_URL;
const token = process.env.TOKEN;
const Redis = require('ioredis'); // Changed import to require
const redis = new Redis(); // Redis client initialization
const { promisify } = require('util');
const { fetch } = require('fetch-ponyfill')();
const fetchAsync = promisify(fetch);
const redisClient = redis



// Function to clear Redis cache
async function clearCache() {
    try {
        // Use the DEL command to delete the cached data
        await redisClient.del('cachedUsers');
        console.log('Cache cleared successfully.');
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}

// Add a route to trigger cache clearance
app.get('/clear-cache', async (req, res) => {
    try {
        await clearCache();
        res.status(200).send('Cache cleared successfully.');
    } catch (error) {
        console.error('Error clearing cache:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const upload = multer({ dest: __dirname + '/uploads/' });
app.use('/uploads', express.static('/'));

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

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session',
    }),
    secret: 'MPILHSALJD',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
}));

async function query(path, config) {
    const res = await fetch(encodeURI(`${url}${path}`), {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        ...config
    });
    return res;
}

// Middleware to check if the user has an active session
const checkSession = (req, res, next) => {
    if (req.session.user) {
        next(); // Continue to the next middleware or route
    } else {
        res.redirect('/login.html'); // Redirect to the login page if no session is found
    }
};

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

async function getAds() {
    try {
        const response = await query('/items/users', {
            method: 'GET'
        });
        if (response.ok) {
            const usersData = await response.json();
            return usersData;
        } else {
            throw new Error('Failed to fetch users data');
        }
    } catch (error) {
        console.error('Error fetching users data:', error);
        throw error; 
    }
}

async function getNews() {
    try {
        const response = await query('/items/news', {
            method: 'GET'
        });
        if (response.ok) {
            const usersData = await response.json();
            return usersData;
        } else {
            throw new Error('Failed to fetch users data');
        }
    } catch (error) {
        console.error('Error fetching users data:', error);
        throw error; // You can handle the error in the calling code
    }
}


async function updateBusiness(userData) {
    try {
        // Use your custom query function to send the update query
        const res = await query(`/items/users/${userData.id}`, {
            method: 'PATCH', // Assuming you want to update an existing item
            body: JSON.stringify(userData) // Convert userData to JSON string
        });
        const updatedData = await res.json();
        return updatedData; // Return updated data
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to update');
    }
}

app.post('/update-business', checkSession, async (req, res) => {
    try {
        // Destructure data from req.body
        const { businessName, businessNiche, businessPhone, location, empNo } = req.body;

        // Extract user id from session
        const id = req.session.user.id;

        // Construct userData object
        const userData = {
            id: id,
            business_name: businessName,
            business_niche: businessNiche,
            business_phone: businessPhone,
            location: location,
            employee_numbers: empNo
        };

        // Call updateBusiness function with userData
        const updatedData = await updateBusiness(userData);

        // Send "ok" response to the frontend
        res.status(200).json({ success: true, message: 'Business updated successfully' });

    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).json({ error: error.message });
    }
});

async function updateProfile(userData) {
    try {
        // Use your custom query function to send the update query
        const res = await query(`/items/users/${userData.id}`, {
            method: 'PATCH', // Assuming you want to update an existing item
            body: JSON.stringify(userData) // Convert userData to JSON string
        });
        const updatedData = await res.json();
        return updatedData; // Return updated data
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to update');
    }
}

async function updatePic(userData) {
    try {
        // Use your custom query function to send the update query
        const res = await query(`/items/users/${userData.id}`, {
            method: 'PATCH', // Assuming you want to update an existing item
            body: JSON.stringify(userData) // Convert userData to JSON string
        });
        const updatedData = await res.json();
        return updatedData; // Return updated data
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to update');
    }
}

async function updatePosts(userData) {
    try {
        // Use your custom query function to send the update query
        const res = await query(`/items/users/${userData.id}`, {
            method: 'PATCH', // Assuming you want to update an existing item
            body: JSON.stringify(userData) // Convert userData to JSON string
        });
        const updatedData = await res.json();
        return updatedData; // Return updated data
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to update');
    }
}

app.post('/update-post', upload.single('image'), async (req, res) => {
    try {
        const { title, body } = req.body;
        const id = req.session.user.id;

        // Ensure that req.file contains the expected file information
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: 'No picture uploaded' });
        }

        // Use req.file.path or other relevant property to get the file path
        const picturePath = req.file.path;

        // Construct userData object with post information and picture path
        const userData = {
            id: id, // Assuming req.user contains user information
            post_image: picturePath,
            post_title: title,
            post_body: body,
        };

        console.log(userData);

        // Update user data with the new post data
        const updatedData = await updatePosts(userData);

        res.status(201).json({ message: 'Post updated successfully', updatedData });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Failed to update post. Please try again.' });
    }
});

async function updateNews(userData) {
    try {
        // Use your custom query function to send the update query
        const res = await query(`/items/news/`, {
            method: 'POST', // Assuming you want to update an existing item
            body: JSON.stringify(userData) // Convert userData to JSON string
        });
        const updatedData = await res.json();
        return updatedData; // Return updated data
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to update');
    }
}

app.post('/update-news', upload.single('image'), async (req, res) => {
    try {
        const { title, body } = req.body;
        const id = req.session.user.fname;
        console.log("User",id)

        // Ensure that req.file contains the expected file information
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: 'No picture uploaded' });
        }

        // Use req.file.path or other relevant property to get the file path
        const picturePath = req.file.path;

        // Construct userData object with post information and picture path
        const userData = {
            user_id: id, // Assuming req.user contains user information
            post_image: picturePath,
            post_title: title,
            post_body: body,
        };

        // console.log(userData);

        // Update user data with the new post data
        const updatedData = await updateNews(userData);
        console.log(updatedData)

        res.status(201).json({ message: 'Post updated successfully', updatedData });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Failed to update post. Please try again.' });
    }
});

app.post('/update-pic', upload.single('profilePic'), async (req, res) => {
    try {
        // Ensure that req.file contains the expected file information
        const id = req.session.user.id;
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: 'No picture uploaded' });
        }

        // Use req.file.path or other relevant property to get the file path
        const picturePath = req.file.path;

        // Update userData object with profile_pic field
        const userData = {
            id: id, // Assuming req.user contains user information
            profile_pic: picturePath
        };

        console.log(userData);

        // Update user data with the new profile pic path
        const updatedData = await updatePic(userData);

        res.status(201).json({ message: 'Profile picture updated successfully', updatedData });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Failed to update profile picture. Please try again.' });
    }
});


app.post('/update-profile', checkSession, async (req, res) => {
    try {
        // Destructure data from req.body
        const { firstname, lastname, phone, } = req.body;

        // Extract user id from session
        const id = req.session.user.id;

        // Construct userData object
        const userData = {
            id: id,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
        };

        console.log(userData);

        // Call updateBusiness function with userData
        const updatedData = await updateProfile(userData);

        // Send "ok" response to the frontend
        res.status(200).json({ success: true, message: 'Business updated successfully' });

    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).json({ error: error.message });
    }
});

async function getProfile(userId) {
    try {
        const res = await query(`/items/users?filter[id][_eq]=${userId}`, {
            method: 'GET',
        });
        return await res.json();
    } catch (error) {
        console.error('Error fetching referrals:', error);
        throw new Error('Error fetching referrals');
    }
}

app.get('/terms&conditions', async (req, res) => {
    try {
        const terms = await getTerms(1);
        // console.log(terms);
        res.render('terms&conditions', { terms });
    } catch (error) {
        console.error('Error fetching terms and conditions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/privacy', async (req, res) => {
    try {
        const privacy = await getPrivacy(1);
        // console.log(privacy);
        res.render('privacy', { privacy });
    } catch (error) {
        console.error('Error fetching privacy terms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/home', checkSession, async (req, res) => {
    try {
        const id = req.session.user.id;
        // const news = await getNews();
        // const newsData = news.data;
        const profiles = await getProfile(id);
        const ads = await getAds();
        const news = await getNews();
        console.log("News",news);
        console.log("Ads",ads.data[0].post_image);
        res.render('home', { userData: profiles.data[0], ads: ads.data, news: news.data});
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
                // Store user information in the session
                req.session.user = {
                    id: user.id,
                    fname: user.firstname,
                    lname: user.lastname,
                    email: user.email,
                    phone: user.phone
                };

                res.json({ success: true, user: req.session.user });
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

app.get('/hustler/dashboard', checkSession,async (req, res) => {

    const id = req.session.user.id;
    const profiles = await getProfile(id);
    res.render('dashboard', { userData: profiles.data[0] });
});

app.listen(port, () => {
    console.log(`Hustlerati listening on port ${port}`);
});
