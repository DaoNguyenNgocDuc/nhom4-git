const { login } = require("../controllers/userController");
const User = require("../models/userModel");
jest.mock('../models/userModel');


describe('login', () => {

    test('should return status false if user not found', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: 'wrongpassword',
            },
        };
        const res = {
            json: jest.fn(),
        };
        await login(req, res);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Incorrect email or password',
            status: false,
        });
    });

    test('should return status false if email or password is incorrect', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: 'wrongpassword',
            },
        };
        User.findOne.mockImplementationOnce(() => ({
            id: 1,
            email: 'test@example.com',
            password: 'correctpassword',
        }));
        const res = {
            json: jest.fn(),
        };
        await login(req, res);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Incorrect email or password',
            status: false,
        });
    });

    test('should return status true and user object if email and password are correct', async () => {
        User.findOne.mockImplementationOnce(() => ({
            id: 1,
            email: 'test@example.com',
            password: '$2b$10$irKURSj5L08BUpqowA3vGuWzNk87ZmTExFh8kdEiaTlVqBPazBrqq',
        }));
        const req = {
            body: {
                email: 'test@example.com',
                password: '123456',
            },
        };
        const res = {
            json: jest.fn(),
        };
        await login(req, res);
        expect(res.json).toHaveBeenCalledWith({
            status: true,
            user: expect.any(Object),
        });
    });
});
