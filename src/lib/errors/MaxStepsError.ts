
export default class MaxStepsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MaxStepsError';
    }
}

