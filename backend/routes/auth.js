const express =  require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')
const JWT_SECRT = 'adityakrjhaitsme';


//  ROUTE 1: Create a user using: POST "/api/auth/createUser" .No login required
router.post('/createUser',[
    body('name',"Enter a vaild name").isLength({ min: 3 }),
    body("email","Enter a vaild email").isEmail(),
    body('password', "Password is must 5 letter").isLength({ min: 5 }),
], async (req, res)=>{
    // If there are errors, returnBad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email exits already
    try {
        
    
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error: "Sorry a user with this email already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash (req.body.password,salt);

    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data ={
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRT);

    // res.json(user)
    res.json({authtoken})
} catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
}
})



//  ROUTE 1: Create a user using: POST "/api/auth/login" .No login required
router.post('/login',[
  body("email","Enter a vaild email").isEmail(),
  body("password","Password cannot be blanks").exists(),
], async (req, res)=>{
   // If there are errors, returnBad request and the errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }

   const {email, password} = req.body;
   try {
    let user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({error: "Please try to login with correct credentials"});
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({error: "Please try to login with correct credentials"});
    }
    
    const data ={
      user:{
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRT);
    res.json({authtoken})
   } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
   }
});


//  ROUTE 1: Get loggedin User Details using: POST "/api/auth/getuser" .login required
router.post('/getuser',fetchuser, async (req, res)=>{
try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user)
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
 }
});
module.exports = router;