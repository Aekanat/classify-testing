import axios from "axios";
import * as fs from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';
import { BASE_URL } from './hostConfig';

describe('Specialization risk endpoint.', () => {
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
    const contras = ["Age","Position","TimeInPos","Gender"];

    const testCases = [];

    factors.forEach(factor => {
        predDataOptions.forEach(pred_data => {
            statuses.forEach(status => {
                impacts.forEach(impact => {
                    contras.forEach(contras => {
                        testCases.push({ factor, pred_data, status, impact, contras });
                    })
                });
            });
        });
    });

    testCases.forEach(({ factor, pred_data, status, impact, contras }) => {
        it(`should return the risk sort by specialization for factor=${factor}, pred_data=${pred_data}, status=${status}, impact=${impact}
        contras=${contras}`, async () => {
            /**
             * For Testing every possible combination of risk sorted by specialization
             */
            const response = await axios.get(`${BASE_URL}/specialization_risk/`, {
                params: {
                    factor,
                    pred_data,
                    status,
                    impact,
                    contras
                }
            });
            const filePath = `/Users/sunson/Desktop/Trainee/eval/specialize_risk/${factor}_${pred_data}_${status}_${impact}_${contras}_specialize_risk_eval.json`;
            const specialization_risk = require(filePath);

            expect(response.status).toBe(200);
            expect(response.data).toEqual(specialization_risk);
        });
    });
});