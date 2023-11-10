import { describe, it, beforeEach, before, after, afterEach } from 'node:test'; 
import assert from 'node:assert';
import crypto from 'node:crypto';
import TodoService from '../src/todoService.js';
import Todo from '../src/todo.js'
import sinon from 'sinon';

describe('todoRepository test Suite', () => {
    describe('#Create', () => {
        let _dependencies;
        let _todoService;
        let _sandbox;

        const mockCreateResult = {
            text: 'I must plan my trip to Europe',
            when: new Date('2020-12-01 12:00:00 GMT-0'),
            status: 'late',
            id: "acfd9e5a-3a42-44a5-87e3-ba221a5ddb20"
        };
        const DEFAULT_ID = mockCreateResult.id;

        before(() => {
            crypto.randomUUID = () => DEFAULT_ID;
            _sandbox = sinon.createSandbox(); 
        });

        after(async () => {
            crypto.randomUUID = (await import('node:crypto')).randomUUID;
        });

        afterEach(() => _sandbox.restore());

        beforeEach((context) => {
            _dependencies = {
                todoRepository: {
                    create: context.mock.fn(async () => mockCreateResult)
                }
            };
            _todoService = new TodoService(_dependencies);
        });

        it(`should create a new item and return it without internal properties`, async () => {
            // Propriedades do Todo
            const todoProperties = {
                text: 'I must plan my trip to Europe',
                when: '2020-12-01 12:00:00 GMT-0'
            };

            const todoItem = new Todo(todoProperties);

            const expected = {
                id: 'acfd9e5a-3a42-44a5-87e3-ba221a5ddb20',
                status: 'late',
                text: 'I must plan my trip to Europe',
                when: new Date('2020-12-01 12:00:00 GMT-0')
            };

            const result = await _todoService.create(todoItem);
            assert.deepStrictEqual(result, expected);
        });
    });
});
