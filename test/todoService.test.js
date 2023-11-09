import { describe, it, beforeEach, before, after, afterEach } from 'node:test'; 
import assert from 'node:assert';
import crypto from 'node:crypto';
import TodoService from '../src/todoService.js';
import Todo from '../src/todo.js'
import sinon from 'sinon';


describe('todoService test Suite', () => {
    describe('#list', () => {
        let _todoService;
        let _dependencies;
        const mockDatabase = [
            {
                text: 'I MUST PLAN MY TRIP TO EUROPE',
                when: new Date('2023-12-01 12:00:00  GMT-0'),
                status: 'late',
                id: 'cf2db4c1-73e6-4299-a976-942139188b7d'
            }
        ]
        beforeEach((context) => {
            _dependencies = {
                todoRepository: {
                    list: context.mock.fn(async  () => mockDatabase)
                }
            }
            _todoService = new TodoService(_dependencies)
        
        })
        it('should return a list of items with uppercase text', async () => {
            const expected = mockDatabase
                .map(({ text, ...result }) => ( new Todo({ text: text.toUpperCase(), ...result })))

            const result = await _todoService.list()
            assert.deepStrictEqual(result, expected)


            const fnMock = _dependencies.todoRepository.list.mock
            assert.deepEqual(fnMock.callCount(), 1)
        })
    })

    describe('#Create', () => {
        let _dependencies;
        let _todoService
        
        let _sandbox = sinon.createSandbox

        const mockCreateResult = {
            text: 'I must plan my trip to Europe',
            when: new Date ('2020-12-01 12:00:00  GMT-0'),
            status: 'late',
            id: "acfd9e5a-3a42-44a5-87e3-ba221a5ddb20"
        }
        const DEFAULT_ID = mockCreateResult.id
        before(() => {
            
            crypto.randomUUID = () => DEFAULT_ID
            _sandbox = sinon.createSandbox(); 
        })

        after(async (context) => {
           crypto.randomUUID = (await import('node:crypto')).randomUUID
        })
        
        afterEach(() => _sandbox.restore())
        beforeEach((context) => {
            _dependencies = {
                todoRepository: {
                    create: context.mock.fn(async  () => mockCreateResult)
                }
            }
            _todoService = new TodoService(_dependencies)
        
        })
        it(` shouldn't save todo item with invalid data`, async () => {
             const input = new Todo({ //dados de entrada 
                text: '',
                when: ''
             })
             const expected = { // o que é experado para o teste passar
                error: {
                    message: 'invalid data',
                    data: {
                        text: '',
                        when: '', 
                        status: '',
                        id: DEFAULT_ID
                    }
                }
             }

             const result = await _todoService.create(input)
             assert.deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))// essa é a regra de negocio do Teste, o esperado!
        })

        it(`should save todo item with late status when the property is further than today`, async () => {
            const properties = { // SEMPRE COLOCAR OS ITENS DE ENTRADA PRIMEIRO
                text: ' I must plan my trip to Europe',
                when: new Date('2020-12-02 12:00:00  GMT-0')
            }
            const input = new Todo(properties)
            const expected = {
                ...properties,
                status: 'pending',
                id: DEFAULT_ID
            }
            const today = new Date('2020-12-01')
            _sandbox.useFakeTimers(today.getTime())

            await _todoService.create(input)

            const fnMock = _dependencies.todoRepository.create.mock
            assert.strictEqual(fnMock.callCount(), 1)
            assert.deepStrictEqual(fnMock.calls[0].arguments[0], expected)
            //console.log(fnMock.calls[0].arguments)
        })

        it(`should save todo item with pending status when the property is in the past`, async () => {
            const properties = { // SEMPRE COLOCAR OS ITENS DE ENTRADA PRIMEIRO
                text: ' I must plan my trip to Europe',
                when: new Date('2020-12-01 12:00:00  GMT-0')
            }
            const input = new Todo(properties)
            const expected = {
                ...properties,
                status: 'late',
                id: DEFAULT_ID
            }
            const today = new Date('2020-12-02')
            _sandbox.useFakeTimers(today.getTime())

            await _todoService.create(input)

            const fnMock = _dependencies.todoRepository.create.mock
            assert.strictEqual(fnMock.callCount(), 1)
            assert.deepStrictEqual(fnMock.calls[0].arguments[0], expected)
            //console.log(fnMock.calls[0].arguments)
        })
    })
})