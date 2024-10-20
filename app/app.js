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
        res.redirect('/login'); // Redirect to the login page if no session is found
    }
};

async function getTerms() {
    try {
        const response = await query('/items/terms', {
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
        throw error; // You can handle the error in the calling code
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

async function getInvestorsBlog() {
    try {
        const response = await query('/items/investors_blog', {
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
            method: 'PATCH',
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
            id: id,
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

async function updateShelf(userData) {
    try {
        const res = await query(`/items/shelf/`, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        const updatedData = await res.json();
        return updatedData;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to update');
    }
}

async function getMyProducts(userId) {
    try {
        const response = await query(`/items/shelf?filter[user_id][_eq]=${userId}`, {
            method: 'GET'
        });

        if (response.ok) {
            const productsData = await response.json();
            return productsData.data;
        } else {
            throw new Error('Failed to fetch products');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

app.post('/update-shelf', upload.single('image'), async (req, res) => {
    try {
        const { name, quantity, price, condition, availability, description } = req.body;
        const id = req.session.user.id;
        const business_niche = req.session.user.business_niche;
        const business_name = req.session.user.business_name;
        const user_firstname = req.session.user.firstname;
        const user_lastname = req.session.user.lastname;

        // Ensure that req.file contains the expected file information
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: 'No picture uploaded' });
        }

        // Use req.file.path or other relevant property to get the file path
        const picturePath = req.file.path;

        // Construct userData object with post information and picture path
        const userData = {
            user_id: id,
            user_firstname: user_firstname,
            user_secondname: user_lastname,
            business_niche: business_niche,
            business_name: business_name,
            item_image: picturePath,
            item_name: name,
            item_quantity: quantity,
            item_price: price,
            item_condition: condition,
            item_availability: availability,
            item_description: description
        };

        // console.log(userData);

        // Update user data with the new post data
        const updatedData = await updateShelf(userData);

        res.status(201).json({ message: 'Shelf updated successfully', updatedData });
    } catch (error) {
        console.error('Error updating shelf:', error);
        res.status(500).json({ message: 'Failed to update shelf. Please try again.' });
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
        const id = req.session.user.id;


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

app.get('/', async (req, res) => {
    res.render('index')
});

app.get('/register-your-business', async (req, res) => {
    res.render('register-your-business')
});

app.get('/blog', async (req, res) => {
    res.render('blog')
});

app.get('/login', async (req, res) => {
    res.render('login');
});

app.get('/terms&conditions', async (req, res) => {
    try {
        const terms = await getTerms();
        console.log("Terms", terms.data[0]);
        res.render('terms&conditions', { terms: terms.data[0] });
    } catch (error) {
        console.error('Error fetching terms and conditions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getPrivacy() {
    const response = await query(`/items/privacy`, {
        method: 'GET',
    });

    console.log("API Response Status:", response.status);
    
    if (response.status !== 200) {
        throw new Error('Failed to fetch privacy data');
    }

    const responseData = await response.json(); // Await the JSON parsing

    // Check if responseData.data is an array and has at least one item
    if (Array.isArray(responseData.data) && responseData.data.length > 0) {
        return responseData.data[0]; // Return the first item from the data array
    } else {
        throw new Error('Privacy data not found');
    }
}

app.get('/privacy', async (req, res) => {
    try {
        const privacy = await getPrivacy();
        // console.log("What I got", privacy);
        res.render('privacy', { privacy }); // Pass privacy as an object
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
        const investorBlogs = await getInvestorsBlog();
        res.render('home', { userData: profiles.data[0], ads: ads.data, news: news.data, blogs: investorBlogs.data });
    } catch (error) {
        console.error('Error fetching home page:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

//         if (result.rows.length > 0) {
//             const user = result.rows[0];
//             const isPasswordMatch = await bcrypt.compare(password, user.password);

//             if (isPasswordMatch) {
//                 // Store user information in the session
//                 req.session.user = {
//                     id: user.id,
//                     fname: user.firstname,
//                     lname: user.lastname,
//                     email: user.email,
//                     phone: user.phone
//                 };

//                 res.json({ success: true, user: req.session.user });
//             } else {
//                 res.status(401).json({ success: false, error: 'Invalid credentials' });
//             }
//         } else {
//             res.status(401).json({ success: false, error: 'Invalid credentials' });
//         }
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ success: false, error: 'Login failed' });
//     }
// });

async function loginUser(email) {
    try {
        // console.log('Querying Directus for user with email:', email);
        const response = await query(`/items/users?filter[email][_eq]=${email}`, {
            method: 'SEARCH',
        });
        const users = await response.json(); // Extract JSON data from the response

        // Check if users array is empty or not
        if (!users || users.length === 0) {
            // console.log('No user found with email:', email);
        }

        return users;
    } catch (error) {
        console.error('Error querying user data:', error);
        throw new Error('Error querying user data');
    }
}

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // console.log('My request', req.body)

        if (!email || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        // Fetch user data from Directus
        const usersResponse = await loginUser(email);

        // If no user found, return invalid credentials error
        if (!usersResponse || !usersResponse.data || usersResponse.data.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = usersResponse.data[0]; // Extract the first user from the response
        // console.log("Found user",user);

        // Compare provided password with the hashed password stored in the user's record
        const passwordMatch = await bcrypt.compare(password, user.password);

        // Handle invalid password
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.user = user;
        // Respond with success message and redirect URL for verified users
        return res.status(200).json({ message: 'Login successful', redirect: '/home' });


    } catch (error) {
        // Handle internal server error
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// app.post('/register-user', async (req, res) => {
//     const { firstName, lastName, email, phone, password } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         const result = await pool.query(
//             'INSERT INTO users (firstname, lastname, email, phone, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//             [firstName, lastName, email, phone, hashedPassword]
//         );

//         res.status(201).json({ success: true, user: result.rows[0] });
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ success: false, error: 'Registration failed' });
//     }
// });

async function registerUser(userData) {
    try {
        let res = await query(`/items/users/`, {
            method: 'POST',
            body: JSON.stringify(userData) // Send user data in the request body
        });
        return await res.json(); // Return parsed JSON response
    } catch (error) {
        console.error('Error registering user:', error);
        throw error; // Rethrow error for handling in the calling function
    }
}

// Route handler for POST /register
app.post('/register-user', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Construct user data object
        const userData = {
            firstname: firstName,
            lastname: lastName,
            email: email,
            phone: phone,
            password: hashedPassword
        };

        // Register the user using the async function
        const newUser = await registerUser(userData);

        // Send response indicating success
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/hustler/dashboard', checkSession, async (req, res) => {
    const id = req.session.user.id;
    const profiles = await getProfile(id);
    const products = await getMyProducts(id);
    res.render('dashboard', { userData: profiles.data[0], products: products });
});

app.get('/loans/page', async (req, res) => {
    res.render('loans');
})

app.get('/hustlers/group/register', async (req, res) => {
    res.render('group-register')
});

async function registerGroup(userData) {
    try {
        let res = await query(`/items/groups/`, {
            method: 'POST',
            body: JSON.stringify(userData) // Send user data in the request body
        });
        return await res.json(); // Return parsed JSON response
    } catch (error) {
        console.error('Error registering user:', error);
        throw error; // Rethrow error for handling in the calling function
    }
}

// Route handler for POST /register
app.post('/register-group', async (req, res) => {
    try {
        const { groupName, leaderName, email, phone, password } = req.body;

        // console.log(req.body);

        // Validate required fields
        if (!groupName || !leaderName || !email || !phone || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Construct user data object
        const userData = {
            groupname: groupName,
            leadername: leaderName,
            email: email,
            phone: phone,
            password: hashedPassword
        };

        // Register the user using the async function
        const newUser = await registerGroup(userData);

        // Send response indicating success
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/hustlers/group/login', async (req, res) => {
    res.render('group-login')
});

async function loginGroup(email) {
    try {
        // console.log('Querying Directus for user with email:', email);
        const response = await query(`/items/groups?filter[email][_eq]=${email}`, {
            method: 'SEARCH',
        });
        const users = await response.json(); // Extract JSON data from the response

        // Check if users array is empty or not
        if (!users || users.length === 0) {
            // console.log('No user found with email:', email);
        }

        return users;
    } catch (error) {
        console.error('Error querying user data:', error);
        throw new Error('Error querying user data');
    }
}

// Login route
app.post('/group-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        // Fetch user data from Directus
        const usersResponse = await loginGroup(email);

        // If no user found, return invalid credentials error
        if (!usersResponse || !usersResponse.data || usersResponse.data.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = usersResponse.data[0]; // Extract the first user from the response

        // Compare provided password with the hashed password stored in the user's record
        const passwordMatch = await bcrypt.compare(password, user.password);

        // Handle invalid password
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.user = user;
        // Respond with success message and redirect URL for verified users
        return res.status(200).json({ message: 'Login successful', redirect: '/hustlers/group/home' });
    } catch (error) {
        // Handle internal server error
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getGroupProfile(userId) {
    try {
        const res = await query(`/items/groups?filter[id][_eq]=${userId}`, {
            method: 'GET',
        });
        return await res.json();
    } catch (error) {
        console.error('Error fetching referrals:', error);
        throw new Error('Error fetching referrals');
    }
}

app.get('/hustlers/group/home', async (req, res) => {
    const id = req.session.user.id;

    const group = await getGroupProfile(id);
    const members = await getGroupMembers(id)
    // console.log("Members found",members.data);
    res.render('group-home', { group: group.data[0], members: members.data });
});

async function updateGroups(userData) {
    try {
        // Use your custom query function to send the update query
        const res = await query(`/items/groups/${userData.id}`, {
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

app.post('/update-group', async (req, res) => {
    try {
        const { group, name, phone, leader } = req.body;
        const id = req.session.user.id;

        const userData = {
            id: id,
            groupname: name,
            phone: phone,
            leadername: leader
        };

        console.log(userData);

        // Update user data with the new post data
        const updatedData = await updateGroups(userData);

        res.status(201).json({ message: 'Post updated successfully', updatedData });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Failed to update post. Please try again.' });
    }
});

async function deleteGroupMember(userData) {
    try {
        const response = await query(`/items/group_members/${userData.id}`, {
            method: 'DELETE',
            body: JSON.stringify(userData)
        });

        if (response.status === 204) {
            // 204 No Content response for successful deletion
            return { message: 'Deleted successfully' };
        } else {
            const updatedData = await res.json();
            return { message: 'Deleted successfully', updatedData };
        }
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to delete');
    }
}

app.post('/delete-group-member', async (req, res) => {
    try {
        const { userId } = req.body;

        console.log(userId)

        const userData = {
            id: userId,
        }

        const updatedData = await deleteGroupMember(userData);

        console.log("Updated", updatedData)

        res.status(201).json({ message: 'Deleted successfully', updatedData });
    } catch (error) {
        console.error('Error in deletion:', error);
        res.status(500).json({ message: 'Failed to delete. Please try again.' });
    }
})

async function updateGroupDescription(userData) {
    try {
        // Use your custom query function to send the update query
        const res = await query(`/items/groups/${userData.id}`, {
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

app.post('/edit-business-description', async (req, res) => {
    try {
        const { groupId, description } = req.body;
        const id = req.session.user.id;

        const userData = {
            id: groupId,
            business_description: description
        };

        // console.log(userData);

        // Update user data with the new post data
        const updatedData = await updateGroupDescription(userData);

        res.status(201).json({ message: 'Post updated successfully', updatedData });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Failed to update post. Please try again.' });
    }
});

async function registerMember(userData) {
    try {
        let res = await query(`/items/group_members/`, {
            method: 'POST',
            body: JSON.stringify(userData) // Send user data in the request body
        });
        return await res.json(); // Return parsed JSON response
    } catch (error) {
        console.error('Error registering user:', error);
        throw error; // Rethrow error for handling in the calling function
    }
}

app.post('/submit-member', upload.single('memberImage'), async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        const id = req.session.user.id;

        // console.log(req.body)

        // Ensure that req.file contains the expected file information
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: 'No picture uploaded' });
        }

        // Use req.file.path or other relevant property to get the file path
        const picturePath = req.file.path;

        // Construct userData object with post information and picture path
        const userData = {
            pic: picturePath,
            name: name,
            phone: phone,
            email: email,
            group: id,
        };

        // console.log(userData);

        // Update user data with the new post data
        const updatedData = await registerMember(userData);

        res.status(201).json({ message: 'Registered successfully', updatedData });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Failed to update post. Please try again.' });
    }
});

async function getGroupMembers(groupId) {
    try {
        const res = await query(`/items/group_members?filter[group][_eq]=${groupId}`, {
            method: 'GET',
        });
        return await res.json();
    } catch (error) {
        console.error('Error fetching referrals:', error);
        throw new Error('Error fetching referrals');
    }
}

async function getProducts() {
    try {
        const response = await query('/items/shelf', {
            method: 'GET'
        });

        // Check if the response is OK
        if (response.ok) {
            const productsData = await response.json();
            return productsData; // Return the complete products data
        } else {
            throw new Error('Failed to fetch products data');
        }
    } catch (error) {
        console.error('Error fetching products data:', error);
        throw error; // Allow the caller to handle the error
    }
}

app.get('/marketplace', checkSession, async (req, res) => {
    try {
        const products = await getProducts();

        // Log the entire products data for debugging
        // console.log("Fetched products:", products);

        // Check if products have data
        if (products && products.data && products.data.length > 0) {
            res.render('marketplace', { products: products.data });
        } else {
            res.render('marketplace', { product: [] }); // Render with empty product array
        }
    } catch (error) {
        console.error('Error fetching marketplace data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function deleteProducts(itemData) {
    try {
        const response = await query(`/items/shelf/${itemData.id}`, {
            method: 'DELETE',
            body: JSON.stringify(itemData)
        });

        if (response.status === 204) {
            // 204 No Content response for successful deletion
            return { message: 'Deleted successfully' };
        } else {
            const updatedData = await res.json();
            return { message: 'Deleted successfully', updatedData };
        }
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to delete');
    }
}

app.post('/delete-item-off-shelf', async (req, res) => {
    try {
        const { itemId } = req.body;

        console.log(itemId)

        const itemData = {
            id: itemId,
        }

        const updatedData = await deleteProducts(itemData);

        console.log("Updated", updatedData)

        res.status(201).json({ message: 'Deleted successfully', updatedData });
    } catch (error) {
        console.error('Error in deletion:', error);
        res.status(500).json({ message: 'Failed to delete. Please try again.' });
    }
});

app.listen(port, () => {
    console.log(`Hustlerati listening on port ${port}`);
});