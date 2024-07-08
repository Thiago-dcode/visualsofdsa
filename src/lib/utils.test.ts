import { describe, expect, it } from 'vitest';
import { getSpeed } from './utils';


describe('testing getSpeed', () => { 


    it('should return the proper number',()=>{

        expect(getSpeed(1)).toBe(1);
        expect(getSpeed(2)).toBe(0.5);
        expect(getSpeed(3)).toBe(0.2);
    })

 })