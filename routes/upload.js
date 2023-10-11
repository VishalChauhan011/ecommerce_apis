// upload using cloudinary
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const router = require('express').Router();


router.route('/').post(upload.single("file"), async (req, res) => {

  console.log(req.file);
  console.log({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_URL
});
    try {
        if (!req.file) {
          return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
    
        const result = await cloudinary.uploader.upload(req.file.path);
    
        // You can now use the `result` object to access the uploaded file details
        res.json({ success: true, data: result.url });
      } catch (error) {
        res.status(500).json({ success: false, error: error});
      }
});

module.exports = router;
  