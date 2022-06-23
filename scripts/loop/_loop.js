/**
 * Loop
 * A simple helper for looping through NodeLists
 * 
 * @example
 *      let foos = document.querySelectorAll(".foo");
 *      
 *      loop(foos, function(foo, i) {
 *          foo.classList.add("bar" + i);
 *      });
 * 
 * @param {NodeList} nodeList The NodeList we are looping through
 * @param {function} func The function we want to execute for each Element in the NodeList
 *      @param {Element} element The individual element that is currently being looked at in the loop
 *      @param {number} index The index of the loop
 */

function loop(nodeList, func) {
    // run a for loop
    for (var index = 0; index < nodeList.length; index++) {
        // set the element to the current index
        let element = nodeList[index];
        // execute the function and pass the element and index to it
        func(element, index);
    }
}