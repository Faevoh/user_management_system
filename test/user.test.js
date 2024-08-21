const mongoose = require("mongoose");
const userModel = require("../model/user.model");
const server = require("../app");
const request = require('supertest');

require("dotenv").config();

describe('User Management API', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.DB_TEST);
    });

    afterEach(async () => {
        await userModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /user', () => {
        it('should create a new user', async () => {
            const newUser = {
                firstName: "Alice",
                lastName: "June",
                email: "alicejune@gmail.com",
                stack: "Backend"
            }

            const res = await request(server).post('/user').send(newUser);
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('New User Created');
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data.firstName).toBe('Alice');
            expect(res.body.data.email).toBe('alicejune@gmail.com');
        });

        it('should not create a user if email already exists', async () => {
            const user = new userModel({
                firstName: "Alice",
                lastName: "June",
                email: "alicejune@gmail.com",
                stack: "Backend"
            });
            await user.save();

            const newUser = {
                firstName: "Joe",
                lastName: "Parker",
                email: "alicejune@gmail.com",
                stack: "Frontend"
            }

            const res = await request(server).post('/user').send(newUser);
            expect(res.status).toBe(422);
            expect(res.body.message).toBe('User with email already exists');
        });
    });

    describe('GET /user', () => {
        it('should retrieve all available users', async () => {
            const users = [
                {
                    firstName: 'Joy',
                    lastName: 'Killah,',
                    email: 'joyKeelah@gmail.com',
                    stack: 'Product Management'
                },
                {
                    firstName: 'Seth',
                    lastName: 'Holly,',
                    email: 'setholly@gmail.com',
                    stack: 'UI/Ux'
                }
            ];
            await userModel.insertMany(users);

            const res = await request(server).get('/user');
            expect(res.status).toBe(200);
            expect(res.body.message).toBe(`${users.length} users`);
            expect(res.body.data.length).toBe(users.length);
        });
    });

    describe('GET /user/:id', () => {
        it('should retrieve details of a user by ID', async () => {
            const user = new userModel({
                firstName: "Unique",
                lastName: "Hex",
                email: "uniquehex@gmail.com",
                stack: "Backend"
            });
            await user.save();

            const res = await request(server).get(`/user/${user._id}`);
            expect(res.status).toBe(200);
            expect(res.body.data.email).toBe('uniquehex@gmail.com');
        });

        it('should return a 404 error if user ID does not exist', async () => {
            const fakeId = '5f50d5c4e1b1a3a7d0c515b2';
            const res = await request(server).get(`/user/${fakeId}`);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User doesn't exist");
        });
    });

    describe('GET /users', () => {
        it('should retrieve user details by firstName', async () => {
            const user = new userModel({
                firstName: "Wills",
                lastName: "Sam",
                email: "willsam@gmail.com",
                stack: "Backend"
            });
            await user.save();

            const res = await request(server).get('/users').query({firstName: 'Wills'});
            expect(res.status).toBe(200);
            expect(res.body.data.email).toBe('willsam@gmail.com');
        });

        it('should return 404 error if user with given firstName does not exist', async () => {
            const res = await request(server).get('/users').query({firstName: "Elijah"});
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User doesn't exist");
        });
    });

    describe('PUT /user/update/:id', () => {
        it('should update user details by ID', async () => {
            const user = new userModel({
                firstName: "Helen",
                lastName: "Parker",
                email: "helenparker@gmail.com",
                stack: "Backend"
            });
            await user.save();

            const updateData = {
                firstName: 'Dany',
                stack: 'Devops'
            };
            const res = await request(server).put(`/user/update/${user._id}`).send(updateData);
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User updated successfully');
            expect(res.body.data.firstName).toBe('Dany');
            expect(res.body.data.stack).toBe('Devops');
        });

        it('should return a 404 error if user ID does not exist', async () => {
            const fakeId = '5f50d5c4e1b1a3a7d0c515b2';
            const updateData = {
                firstName: 'Dany',
                stack: 'Devops'
            };
            const res = await request(server).put(`/user/update/${fakeId}`).send(updateData);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User doesn't exist");
        });
    });

    describe('PUT /user/update', () => {
        it('should update user details by firstName', async () => {
            const user = new userModel({
                firstName: "Frank",
                lastName: "Loren",
                email: "frankloren@gmail.com",
                stack: "Backend"
            });
            await user.save();

            const updateData = {
                lastName: 'Eugene'
            };
            const res = await request(server).put('/user/update').query({firstName: 'Frank'}).send(updateData);
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User updated successfully');
            expect(res.body.data.lastName).toBe('Eugene');
        });

        it('should return a 404 if user with given firstName does not exist', async () => {
            const updateData = {
                lastName: 'Eugene'
            };
            const res = await request(server).put('/user/update').query({firstName: 'Rosa'}).send(updateData);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User doesn't exist");
        });
    });

    describe('DELETE /user/delete/:id', () => {
        it('should delete a user by ID', async () => {
            const user = new userModel({
                firstName: "Cherish",
                lastName: "Roots",
                email: "cherishroots@gmail.com",
                stack: "Product Manager"
            });
            await user.save();

            const res = await request(server).delete(`/user/delete/${user._id}`);
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User deleted successfully');
        });

        it('should return a 404 error if user ID does not exist', async () => {
            const fakeId = '5f50d5c4e1b1a3a7d0c515b2';
            const res = await request(server).delete(`/user/delete/${fakeId}`);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User doesn't exist");
        });
    });

    describe('DELETE /user/delete', () => {
        it('should delete a user by firstName', async () => {
            const user = new userModel({
                firstName: "Henry",
                lastName: "Danger",
                email: "henrydanger@gmail.com",
                stack: "UI/UX"
            });
            await user.save();

            const res = await request(server).delete('/user/delete').query({firstName: 'Henry'});
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("User deleted successfully");
        });

        it('should return a 404 error if the user with the given first name does not exist', async () => {
            const res = await request(server).delete('/user/delete').query({ firstName: 'Sally' });
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User doesn't exist");
        });
    });
});

