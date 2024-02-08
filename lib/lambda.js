const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3();
exports.handler = async (event, context) => {
    // Create a file
    const fileName = 'example.txt';
    const fileContent = 'Hello, this is an example file!';
    fs.writeFileSync(fileName, fileContent);

    // Upload the file to S3
    const params = {
        Bucket: 'your-bucket-name',
        Key: fileName,
        Body: fs.createReadStream(fileName)
    };

    try {
        const data = await s3.upload(params).promise();
        console.log('File uploaded successfully:', data.Location);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully', location: data.Location })
        };
    } catch (err) {
        console.error('Error uploading file:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error uploading file', error: err })
        };
    } finally {
        // Clean up: delete the local file
        fs.unlinkSync(fileName);
    }
};
