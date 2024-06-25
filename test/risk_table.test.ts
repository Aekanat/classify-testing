import axios, { AxiosError } from "axios";
import * as fs from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';
import { BASE_URL } from './hostConfig';

const centerThrRiskTable = require('/Users/sunson/Desktop/Trainee/eval/center_thr_risk_table.json');
const lowThrRiskTable = require('/Users/sunson/Desktop/Trainee/eval/low_thr_risk_table.json');

describe('show risk table endpoint', () => {
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

    it('should return the risk table when using center threshold probability', async () => {
        /**
         * For testing every possible combination of risk Table with Center Probability Threshold
         */
        const response = await axios.get(`${BASE_URL}/show_risk_table/?risk_thr=center_risk_probability_threshold`);
    
        expect(response.status).toBe(200);
        expect(response.data).toEqual(centerThrRiskTable);
    });

    it('should return the risk table when using low threshold probaility', async () => {
        /**
         * For testing every possible combination of risk Table with Low Probability Threshold
         */
        const response =await axios.get(`${BASE_URL}/show_risk_table/?risk_thr=low_risk_probability_threshold`);

        expect(response.status).toBe(200);
        expect(response.data).toEqual(lowThrRiskTable);
    });
});
