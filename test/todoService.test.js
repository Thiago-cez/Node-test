import { describe, it, beforeEach } from 'node:test'; 
import TodoService from '../src/todoService.js';
import assert from 'node:assert'
import Todo from '../src/todo.js'

describe('todoService test Suite', () => {
    describe('#list', () => {
        let _todoService;
        let _dependencies;
        const mockDatabase = [
            {
                text: 'I MUST PLAN MY TRIP TO EUROPE',
                when: new Date('2021-03-22T00:00:00.000Z'),
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
                .map(({ text, ...result }) => ({ text: text.toUpperCase(), ...result }))

            const result = await _todoService.list()
            assert.deepStrictEqual(result, expected)


            const fnMock = _dependencies.todoRepository.list.mock
            assert.deepEqual(fnMock.callCount(), 1)
        })
    })

    describe('#Create', () => {
        let _dependencies;
        let _todoService
        const mockCreateResult = {
            text: 'I must plan my trip to Europe',
            when: new Date ('2021-03 - 22T00:00:000z'),
            status: 'late',
            id: "a5s4df7f57f7vg7g57h"
        }

        beforeEach((context) => {
            _dependencies = {
                todoRepository: {
                    create: context.mock.fn(async  () => mockDatabase)
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
                    data: input
                }
             }
        })
    })
})