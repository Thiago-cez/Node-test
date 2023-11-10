export default class TodoRepository {
    #schedule;

    constructor({ db }) {
        this.#schedule = db.addCollection('schedule');
    }

    get schedule() {
        return this.#schedule;
    }

    async list() {
        // deveria ser um .project() mas não temos no lokijs
        const scheduleData = this.#schedule.find();
        return scheduleData ? scheduleData.map(({ meta, $loki, ...result }) => result) : [];
    }

    async create(data) {
        const { $loki, meta, ...result } = this.#schedule.insertOne(data);
        return result;
    }
}
