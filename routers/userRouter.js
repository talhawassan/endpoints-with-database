const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/usermodel')
const auth = require('../middlewares/auth')
// require('../config/passport')(passport)
require('../config/facebook-passport')
const router = new express.Router()

router.get('/', (req, res) => {
    res.send('server is running fine')
})

//user sign up route

router.post('/users/signup', async (req,res) => {  
    const user = new User(req.body)
    const salt = await bcrypt.genSalt(10);
     
    try {
        user.password = await bcrypt.hash(user.password, salt);
        // Create token
       const token = jwt.sign(
       {_id: user._id },
         process.env.TOKEN_KEY,
         {
          expiresIn: 86400,
            }
          );
        // save user token
       user.token = token;
       await user.save()
       res.status(201).send(user)
    }catch (e) {
       res.status(400).send(e)
    }
})

//user login route

router.post('/users/login', async (req, res) => {

    const { email, password } = req.body
        if (!email || !password) {
    return res.status(400).json({
      message: "email or Password not present",
    })
  }

  try {
       const user = await User.findOne({email})
       if(!user) {
          return res.status(404).json('user does not exist')
       }
       const isMatch = await bcrypt.compare(password, user.password)
       if(!isMatch) {
        return res.status(400).json('unable to login')
       }
   
       const token = jwt.sign({_id: user._id}, process.env.TOKEN_KEY, { expiresIn: 86400 } )
       user.token = token

       res.send(`welcome ${user.name}`)
  } catch(e) {
       res.status(400).send('Invalid Credentials')
  }
})

// to check user authenticity you should pass the user token in postman headers wih x-access-token

router.get("/welcome/login", auth, (req, res) => {  
  res.status(200).send("Welcome 🙌 ");
});

//get all users route

router.get('/users/list', async (req,res) => {   
     try {
        const user = await User.find({})
        res.send(user)
     } catch (e) {
        res.status(500).send(e)
     }
})

//read single user route

router.get('/users/:id', async (req, res) => { 
    const _id = req.params.id
    try {
       const user = await User.findById(_id)
       if(!user){
         return res.status(404).send()
       }
       res.status(201).send(user)
    }catch (e) {
        res.status(500).send(e)
    }
})

//update user with id

router.patch('/users/:id', async (req,res) => {
  try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new : true })
      if(!user){
         return res.status(404).send()
      }
      res.send(user)
  }catch(e) {
      res.status(400).send(e)
  }
})



//sign up with google routers

// const isLoggedIn = (req, res, next) => {
//   return req.user ? next() : res.status(401).send()
// }

// router.get('/auth/failure', (req, res) => {
//   res.send('something went wrong..')
// })

// router.get('/protected', isLoggedIn , (req, res) => {
//   res.send(`Hello ${req.user.displayName}`)
// })

router.get('/signup/google', (req,res) => {
  res.send('<a href="/auth/google"> Authentication with google </a>')
})


router.get('/google/welcome', (req,res) => {
  res.send('welcome user')
})

router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/google/welcome');
  });

  //sign up with facebook routes
  router.get('/signup/facebook', (req,res) => {
    res.send('<a href="/auth/facebook"> Authentication with facebook</a>')
  })

  router.get('/auth/facebook', 
  passport.authenticate('facebook', { scope : 'email' })); //newly added

  router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/profile');
  });

  // router.get('facebook/callback', passport.authenticate('facebook', {
  //     successRedirect: '/profile',
  //     failureRedirect: '/failed'
  // }))

  router.get('/profile', (req,res) => {
    res.send('you are a valid user')
  })

  router.get('/failed', (req,res) => {
    res.send('you are non valid user')
  })
//   //User gets here upon successful login
// router.get('/home', (req, res) => {
//   res.json({ user: user });
// });

// //This is so you know if a Login attempt failed
// router.get('/fb/login', (req, res) => { 
// res.json({msg: "login failed"}); 
// });

// //This endpoint connects the User to Facebook
// router.get('/login/facebook', passport.authenticate('facebook'));

// //This endpoint is the Facebook Callback URL and on success or failure returns a response to the app
// router.get('/auth/facebook/callback', passport.authenticate('facebook', {          
//           failureRedirect: '/fb/login' }), (req, res) => {
//                    res.redirect('/user/home');
// })

module.exports = router