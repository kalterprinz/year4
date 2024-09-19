const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserModel = require('./User');
const VenueModel = require('./Venue');
var cors = require ('cors')

const app = express();
const port = 3001;
app.use(cors())

app.use(express.json())

mongoose.connect('mongodb://127.0.0.1/ICTPMO',{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then(db=>console.log('DB is connected'))
.catch(err=> console.log(err));


app.get('/users/:id', (req, res)=>{
    const id = req.params.id
    UserModel.findOne({_id: id})
        .then(post=> res.json(post))
        .catch(err=> console.json(err))
})


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.status(200).json({ message: "Login successful", userId: user._id,role: user.role });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An error occurred during login" });
    }
});

app.post('/signup', async (req, res) => {
    const { email, userstatus, password } = req.body;
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new UserModel({
        email,
        userstatus,
        password: hashedPassword,
      });
  
      const user = await newUser.save();
      res.status(201).json(user);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Failed to create user' });
    }
});


app.listen(port,()=>{
    console.log('Example app listening on port ${port}')
})