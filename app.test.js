const request = require('supertest');
const baseURL = "http://localhost:3000"

const app = require('./app'); // Adjust the path based on your project structure


describe("GET /clone", () => {
    const testUrl = "https://github.com/jun-ro/ExampleHermesStorage.git";

    afterAll(async () => {
        // Clean up after the test by deleting the grabbed repository
        await request(baseURL).get(`/clone?url=${testUrl}`);
    });

    it("should say 'Repository Cloned Successfully'", async () => {
        const response = await request(baseURL).get(`/clone?url=${testUrl}`);


        // Assert that the response status is 200
        expect(response.status).toBe(200);

        const responseBody = JSON.parse(response.text);
        // Assert that the response message is as expected

        expect(responseBody.message).toBe("Repository cloned successfully.");
    });

});