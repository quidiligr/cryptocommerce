const express = require('express')
//var bcrypt = require('bcrypt');
const router = express.Router()
const upload = require('../upload')

// Set up a route for file uploads
router.post('/', upload.single('file'), (req, res) => {
    // Handle the uploaded file
    //console.log('9: File uploaded successfully!' )
    //res.json({ message: 'File uploaded successfully!' });
    res.redirect('/vendor/product-list')
  });


  

module.exports = router;
