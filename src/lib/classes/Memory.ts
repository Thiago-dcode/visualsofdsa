export default abstract class Memory {

    constructor(private _memoryAdress = '') {

    }

    get memoryAddress() {
        return this._memoryAdress;
    }
    set memoryAddress(memoryAddress: string) {
        this._memoryAdress = memoryAddress;
    }

}