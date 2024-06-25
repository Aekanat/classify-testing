import axios from "axios";
import * as fs from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';
import { BASE_URL } from "./hostConfig";



describe('overall risk end point.',()=>{
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
    
    const factors = ['Engagement', 'Demographic', 'Both'];
    const predDataOptions = [true, false];
    const statuses = ['Stay', 'Resign', 'Both'];
    const impacts = ['MostInfluencing', 'MostAttritional', 'MostRetentive'];

    const testCases = [];

    factors.forEach(factor => {
        predDataOptions.forEach(pred_data => {
            statuses.forEach(status => {
                impacts.forEach(impact => {
                    testCases.push({ factor, pred_data, status, impact });
                });
            });
        });
    });

    testCases.forEach(({ factor, pred_data, status, impact }) => {
        it(`should return the overall risk for factor=${factor}, pred_data=${pred_data}, status=${status}, impact=${impact}`, async () => {
            /**
             * For Testing every possible combination of overall risk
             */
            const response = await axios.get(`${BASE_URL}/overall_risk/`, {
                params: {
                    factor,
                    pred_data,
                    status,
                    impact
                }
            });
            const filePath = `/Users/sunson/Desktop/Trainee/eval/overall_risk/${factor}_${pred_data}_${status}_${impact}_overall_risk_eval.json`;
            const overall_risk = require(filePath);

            expect(response.status).toBe(200);
            expect(response.data).toEqual(overall_risk);
        });
    });

})