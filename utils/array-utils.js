
/**
 * A group of utility functions for array based manipulation
 * @class
 */
export default class ArrayUtils{

    /**
     * Takes an array of sorted items and computes an array of sorted repeats of the items in O(N) time, where N is the number of items. It
     * behaves like a roundrobin algorithm.
     * 
     * Check inner documentation to see time complexity analysis.
     * 
     * Example
     * input items = [ 1,2,2,3,4,4,5,5,5,6 ]
     * sortedRepeats = [1,2,3,4,5,6] + [2,4,5] + [5]
     * output items = [1,2,3,4,5,6,2,4,5,5]
     * 
     * @param {Object[]} sortedItems An array of sorted items
     * @param {string} repeatProp A property used to identify items, two items are considered the same when 
     * the value of the property in both items are equal
     * @param {boolean} strictCompare Whether to use strict comparison when comparing item property values
     * @returns {Object[]} A computed array of all items
     */
    static createSortedRepeat( sortedItems , repeatProp , strictCompare ){

        if( !Array.isArray(sortedItems) ) throw new Error('items must be an array');

        if( typeof repeatProp !== 'string' ) throw new Error('repeatProp must be a string');

        if( typeof strictCompare !== 'boolean' ) throw new Error('strictCompare must have a boolean type');

        // Holds all sorted repeats as an array of arrays
        const sortedRepeats = [];

        const itemsLength = sortedItems.length;

        /**
         * as a loop runs from on start of the items array to the end, will be used to identify repeats in the array of items
         * 
         * at any stage of the loop:
         * 1) a value of 0 means, the first appearance of an item is found i.e. no repeats yet
         * 2) a value of 1 means, the second appearance found 
         * 3) a nth value means, the nth appearance is found
         * 
         * @var {number}
         */
        let itemRepeatCount;

        /**
         * @NOTE : Runs in O(N) time, seeing there are no inner loops
         */
        for( let i = 0 ; i < itemsLength ; i++ ){

            const item = sortedItems[i];

            // get the value used for tracking repeats
            const repeatableValue = item[repeatProp];

            // check if current item is first item in the array
            if( i < 1 ){
                itemRepeatCount = 0;
            }
            else {

                const prevRepeatableValue = sortedItems[ i - 1 ] [repeatProp];

                // check if current item is the same with previous item
                if( strictCompare ? repeatableValue === prevRepeatableValue : repeatableValue == prevRepeatableValue ){
                    itemRepeatCount++;
                }
                else{
                    itemRepeatCount = 0;
                }
            }

            // the index of the inner array where the item will be appended
            const sortedRepeatsArrayIndex = itemRepeatCount;

            if( !Array.isArray( sortedRepeats [ sortedRepeatsArrayIndex ] ) ){
                sortedRepeats [ sortedRepeatsArrayIndex ] = [ item ];
            }
            else{
                sortedRepeats [ sortedRepeatsArrayIndex ].push(item);
            }
        }

        // holds a combined array of all sorted repeats
        const result = [];

        /**
         * Runs in O(N) time, because the loop and the spread operator(...) combined will not run more than the number of items 
         * initially passed to the function.
         */
        for( const items of sortedRepeats ){
            result.push( ...items );
        }

        /**
         * Since there are two adjacent loops that each runs in O(N) time and other instructions run in O(1) time
         * 
         * O(1) will be consumed by O(N)
         * 
         * The time complexity( for two loops ) will be O(N) + O(N) = O(2N) = O(N)
         * 
         * hence the result is computed in O(N) time
         */
        return result;
    }
}
