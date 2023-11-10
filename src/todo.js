import crypto from 'node:crypto'

export default class Todo {
    constructor({ text, when, status, id }) {
        this.text = text
        this.when = when
        this.status = status ??  ''
        this.id = id ?? crypto.randomUUID()
    }

    isValid() {
        if (!this.text || !this.when) {
            return false;
        }
    
        // Defina a propriedade status com base nas condições desejadas
        this.status = this.when > new Date() ? 'pending' : 'late';
    
        return true;
    }

}

