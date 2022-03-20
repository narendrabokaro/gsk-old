const request = require("supertest");
const app = require("./index");

describe(' Project Management Web Api', () => {
    describe('Projects', () => {
        it('should return all records', () => {
            return request(app)
                .get('/api/projects')
                .expect('Content-type', /json/)
                .expect(200)
                .then((response) => {
                    expect(response.body.length).toEqual(3);
                    expect(response.body[0]).toEqual(
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                            description: expect.any(String),
                            startDate: expect.any(String),
                            employees: expect.any(Array)
                        })
                    );
                });
        });

        it('should return a record if a valid project Id provided', () => {
            return request(app)
                .get('/api/projects/102')
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            id: 102, 
                            name: 'TherafluMedicineSalesHistoryDeal2021', 
                            description: 'Medicine sales history to show sales performance of the Theraflu medicine', 
                            startDate: '2021-04-03', 
                            employees: ['gsk104', 'gsk105']
                        })
                    );
                });
        });

        it('should error 404 if invalid project id provided', () => {
            return request(app)
                .get('/api/projects/19388')
                .expect(404);
        });

        it('should create a project if valid data provided', () => {
            return request(app)
                .post('/api/projects')
                .send({
                    name: 'CovidFluDrugControl2021', 
                    description: 'Medicine which control the covid and its various forms',
                    startDate: '2022-04-03', 
                    employees: ['gsk104', 'gsk105']
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            id: 104,
                            name: 'CovidFluDrugControl2021', 
                            description: 'Medicine which control the covid and its various forms',
                            startDate: '2022-04-03', 
                            employees: ['gsk104', 'gsk105']
                        })
                    );
                });
        });

        it('should validation error 400 if invalid data provided for project creation', () => {
            return request(app)
                .post('/api/projects')
                .send({
                    name: 'covid flu medicine',
                    desription: ''
                })
                .expect(400);
        });

        it('should update a project', () => {
            return request(app)
                .put('/api/projects/102')
                .send({
                    name: 'TherafluMedicineSalesHistoryDeal2023',
                    description: 'Medicine sales history to show sales performance of the Theraflu family of medicine', 
                    startDate: '2024-04-03', 
                    employees: ['gsk104', 'gsk105']
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            name: 'TherafluMedicineSalesHistoryDeal2023',
                            description: 'Medicine sales history to show sales performance of the Theraflu family of medicine', 
                            startDate: '2024-04-03', 
                            employees: ['gsk104', 'gsk105']
                        })
                    );
                });
        });
    });

    describe('Employee', () => {
        it('should return all records', () => {
            return request(app)
                .get('/api/employees')
                .expect('Content-type', /json/)
                .expect(200)
                .then((response) => {
                    expect(response.body.length).toEqual(6);
                    expect(response.body[0]).toEqual(
                        expect.objectContaining({
                            employeeID: expect.any(String),
                            name: expect.any(String)
                        })
                    );
                });
        });

        it('should create a employee if valid data provided', () => {
            return request(app)
                .post('/api/employees')
                .send({
                    employeeID: 'gsk109',
                    name: 'Yash'
                })
                .expect(200)
                .then((response) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            employeeID: 'gsk109',
                            name: 'Yash'
                        })
                    );
                });
        });
    });
});