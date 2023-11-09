import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import sinon from 'sinon';
import Loki from 'lokijs';
import TodoRepository from '../src/todoRepository.js';

describe('TodoRepository test Suite', () => {
    let _todoRepository;
    let _sandbox;

    beforeEach(() => {
        _sandbox = sinon.createSandbox();
        const mockDb = new Loki();  // Criação de um banco de dados loki-mock
        _todoRepository = new TodoRepository({ db: mockDb });
    });

    afterEach(() => {
        _sandbox.restore();
    });

    describe('#list', () => {
        it('should return a list of items without internal properties', async () => {
            // Mock dos dados no banco de dados
            const mockDatabase = [
                {
                    text: 'I MUST PLAN MY TRIP TO EUROPE',
                    when: new Date('2023-12-01 12:00:00 GMT-0'),
                    status: 'late',
                    id: 'cf2db4c1-73e6-4299-a976-942139188b7d',
                    $loki: 123,
                    meta: {}
                }
                // Adicione mais dados conforme necessário
            ];

            // Mock do método find do lokijs
            _sandbox.stub(_todoRepository.#schedule, 'find').returns(mockDatabase);

            const result = await _todoRepository.list();

            // Verifica se o método find foi chamado
            assert.strictEqual(_todoRepository.#schedule.find.calledOnce, true);

            // Verifica se o resultado contém apenas as propriedades necessárias
            const expected = mockDatabase.map(({ meta, $loki, ...result }) => result);
            assert.deepStrictEqual(result, expected);
        });
    });

    describe('#create', () => {
        it('should create a new item and return it without internal properties', async () => {
            const inputData = {
                text: 'I must plan my trip to Europe',
                when: new Date('2020-12-01 12:00:00 GMT-0'),
                status: 'late',
                id: 'acfd9e5a-3a42-44a5-87e3-ba221a5ddb20'
            };

            // Mock do método insertOne do lokijs
            const mockInsertOneResult = { ...inputData, $loki: 789, meta: {} };
            _sandbox.stub(_todoRepository.#schedule, 'insertOne').returns(mockInsertOneResult);

            const result = await _todoRepository.create(inputData);

            // Verifica se o método insertOne foi chamado
            assert.strictEqual(_todoRepository.#schedule.insertOne.calledOnce, true);

            // Verifica se o resultado contém apenas as propriedades necessárias
            const expected = { ...inputData, id: mockInsertOneResult.$loki };
            assert.deepStrictEqual(result, expected);
        });
    });
});
