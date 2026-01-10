// test-backend-upload.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Configuration
const BACKEND_URL = 'http://localhost:4000/api/v1/users/profile/photo';
// You need a valid JWT token here. If you don't have one, you might need to login first.
// For testing, if you can get a token from your browser devtools (Network tab -> Authorization header), paste it here.
const TOKEN = process.argv[2]; 

if (!TOKEN) {
  console.error('Usage: node test-backend-upload.js <YOUR_JWT_TOKEN>');
  process.exit(1);
}

async function testUpload() {
  try {
    // Create a dummy image file
    const dummyImagePath = path.join(__dirname, 'test-image.png');
    // Create a simple 1x1 pixel PNG
    const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(dummyImagePath, buffer);

    console.log('Created dummy image at:', dummyImagePath);

    const formData = new FormData();
    formData.append('photo', fs.createReadStream(dummyImagePath));

    console.log('Uploading to:', BACKEND_URL);

    const response = await axios.post(BACKEND_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    console.log('Upload Success!');
    console.log('Status:', response.status);
    console.log('Data:', response.data);

    // Cleanup
    fs.unlinkSync(dummyImagePath);
  } catch (error) {
    console.error('Upload Failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testUpload();
