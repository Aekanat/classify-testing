import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';

describe('FastAPI Server', () => {
  it('should upload a CSV and JSON file successfully', async () => {
    const form = new FormData();
    const csvFilePath = path.join('./test/testFile', 'testData.csv');
    const modelFilePath = path.join('./test/testFile', 'testModel.json');
    
    form.append('file', fs.createReadStream(csvFilePath));
    form.append('model', fs.createReadStream(modelFilePath));
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/upload_model_&_csv/', form, {
        headers: form.getHeaders()
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'File and Model uploaded successfully.' });
    } catch (error) {
      throw new Error(`Unexpected error: ${error.message}`);
    }
  });

  it('should return an error for a non-CSV file', async () => {
    const form = new FormData();
    const filePath = path.join('./test/testFile', 'testData.txt'); // Non-CSV File Testing
    form.append('file', fs.createReadStream(filePath));
    
    const modelFilePath = path.join('./test/testFile', 'testModel.json');
    form.append('model', fs.createReadStream(modelFilePath));
    
    try {
      await axios.post('http://127.0.0.1:8000/upload_model_&_csv/', form, {
        headers: form.getHeaders()
      });
    } catch (error) {
      expect(error.response.status).toBe(422);
      expect(error.response.data.detail).toBe('File must be a CSV.');
      return; 
    }
    throw new Error('Expected error for non-CSV file was not thrown.');
  });

  it('should return an error for a non-JSON model file', async () => {
    const form = new FormData();
    const csvFilePath = path.join('./test/testFile', 'testData.csv');
    form.append('file', fs.createReadStream(csvFilePath));
    
    const filePath = path.join('./test/testFile', 'testModel.txt'); // Non-JSON File Testing
    form.append('model', fs.createReadStream(filePath));
    
    try {
      await axios.post('http://127.0.0.1:8000/upload_model_&_csv/', form, {
        headers: form.getHeaders()
      });
    } catch (error) {
      expect(error.response.status).toBe(422);
      expect(error.response.data.detail).toBe('File must be a JSON.');
      return; 
    }
    
    throw new Error('Expected error for non-JSON model file was not thrown.');
  });
});
