import axios from "axios";
import * as fs from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';
import { BASE_URL } from './hostConfig';


const centerRiskThr = require('/Users/sunson/Desktop/Trainee/eval/center_thr_engagement.json');
const lowRiskThr = require('/Users/sunson/Desktop/Trainee/eval/low_thr_engagement.json');    

describe('engagement risk endpoint.', () => {
    beforeEach(async () => {
        /**
         * Before using any Endpoint, CSV and model must be uploaded
         */
        const csvFilePath = path.join('./test/testFile', 'testData.csv');
        const modelPath = path.join('./test/testFile', 'testModel.json');
    
        const formData = new FormData();
        formData.append('file', fs.createReadStream(csvFilePath), 'testData.csv');
        formData.append('model', fs.createReadStream(modelPath), 'testModel.json');
    
        try {
            const response = await axios.post(`${BASE_URL}/upload_model_&_csv/`, formData);
    
            if (response.status !== 200) {
                throw new Error('Failed to upload CSV and model');
            }
        } catch (error) {
            throw new Error(`Error during beforeEach: ${error.message}`);
        }
    });

    it('should return the risk when using center threshold probability', async () => {
        /**
         * For testing every possible combination of risk sorted by Engagement Level with Center Probability Threshold
         */
        const response = await axios.get(`${BASE_URL}/engagement_risk/?risk_thr=center_risk_probability_threshold`);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(centerRiskThr);
    }); 

    it('should return the risk when using low threshold probability', async () => {
        /**
         * For testing every possible combination of risk sorted by Engagement Level with Low Probability Threshold
         */
        const response = await axios.get(`${BASE_URL}/engagement_risk/?risk_thr=low_risk_probability_threshold`);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(lowRiskThr);
    });
})