import axios from "axios";
import * as fs from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';
import { BASE_URL } from './hostConfig';

describe('Through the Years endpoint.', () => {
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
    const predictYear = ['2018', '2019','2020','2021','2022'];
    const statuses = ['Stay', 'Resign', 'Both'];
    const impacts = ['MostInfluencing', 'MostAttritional', 'MostRetentive'];
    const contras = ["Age","Position","TimeInPos","Gender"];

    const testCases = [];

    factors.forEach(factor => {
        predictYear.forEach(predictYear => {
            statuses.forEach(status => {
                impacts.forEach(impact => {
                    contras.forEach(contras => {
                        testCases.push({ factor, predictYear, status, impact, contras });
                    })
                });
            });
        });
    });

    testCases.forEach(({ factor, predictYear, status, impact, contras }) => {
        it(`should return the through the years risk for pred_year=${predictYear}, factor=${factor}, status=${status}, impact=${impact}
        contras=${contras}`, async () => {
            /**
             * For Testing every possible combination of risk through the years
             */
            const response = await axios.get(`${BASE_URL}/through_the_years/`, {
                params: {
                    predictYear,
                    factor,
                    status,
                    impact,
                    contras
                }
            });
            const filePath = `/Users/sunson/Desktop/Trainee/eval/risk_through_the_years/${factor}_${predictYear}_${status}_${impact}_${contras}_through_the_years_eval.json`;
            const risk_through_the_years = require(filePath);

            expect(response.status).toBe(200);
            expect(response.data).toEqual(risk_through_the_years);
        });
    });
})