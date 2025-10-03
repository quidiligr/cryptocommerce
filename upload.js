const fs = require('fs');
const path = require('path')
const multer = require('multer')

const uploadDirectory = './public/uploads';

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       
      console.log(`11: upload saved ${uploadDirectory}`)
            cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
      let filename = Date.now() + '-' + file.originalname;
      console.log(`15: upload ${filename}`)
      cb(null, filename);
    }
  });

  // Create the multer instance
const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, callback) {
  var ext = path.extname(file.originalname);
  if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
  }
  callback(null, true)
},
limits:{
  fileSize: 1048576 * 100, // 1mb * 100  allowed //1024 * 1024
  
} });

module.exports = upload;