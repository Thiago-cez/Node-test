import crypto from 'node:crypto'

export default class Todo {
    constructor({ text, when, status, id }) {
        this.text = text
        this.when = when

        this.status = status ??  ''
        this.id = id ?? crypto.randomUUID()
    }

    isValid() {
        //  - !!
        return !!this.text && !isNaN(this.when.valueOf())
    }

}

