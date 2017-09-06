export default class ComplexStore<KeyType, ValueType> {
    private keyList: KeyType[];
    private valueList: ValueType[];

    constructor() {
        this.keyList = [];
        this.valueList = [];
    }

    put(key: KeyType, value: ValueType) {
        this.keyList.push(key);
        this.valueList.push(value);
    }

    contains(key: KeyType): boolean {
        return this.keyList.indexOf(key) >= 0;
    }

    containsValue(value: ValueType): boolean {
        return this.valueList.indexOf(value) >= 0;
    }

    get(key: KeyType): ValueType {
        const index = this.keyList.indexOf(key);
        return this.valueList[index];
    }

    getByValue(value: ValueType): KeyType {
        const index = this.valueList.indexOf(value);
        return this.keyList[index];
    }

    getEntries(): [KeyType, ValueType][] {
        const entries: [KeyType, ValueType][] = [];
        for(let i = 0; i < this.keyList.length; i++) {
            entries.push([this.keyList[i], this.valueList[i]]);
        }
        return entries;
    }

    delete(key: KeyType): boolean {
        const index = this.keyList.indexOf(key);
        if (index) {
            this.keyList.splice(index, 1);
            this.valueList.splice(index, 1);
            return true;
        }
        return false;
    }

    deleteByValue(value: ValueType): boolean {
        const index = this.valueList.indexOf(value);
        if (index) {
            this.keyList.splice(index, 1);
            this.valueList.splice(index, 1);
            return true;
        }
        return false;
    }

    clear(): void {
        this.keyList = [];
        this.valueList = [];
    }
}