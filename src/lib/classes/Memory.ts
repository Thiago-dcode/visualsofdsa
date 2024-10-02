export default abstract class Memory {

    constructor(private _memoryAdress = '', private _isActive = false) {

    }

    get memoryAddress() {
        return this._memoryAdress;
    }
    set memoryAddress(memoryAddress: string) {
        this._memoryAdress = memoryAddress;
    }
    get isActive(): boolean {
        return this._isActive;
    }
    set isActive(isActive: boolean) {
        this._isActive = isActive;
    }
}