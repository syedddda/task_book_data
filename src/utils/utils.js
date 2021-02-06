// To format number with commas
export const formattedNumber = ( theNumber ) => {
    theNumber = theNumber.toString();
    const pattern = /(-?\d+)(\d{3})/;

    while (pattern.test(theNumber)) {
        theNumber = theNumber.replace(pattern, "$1,$2");
    }
    
    return theNumber;
}

// To load state from localstorage
export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('state');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
}; 

// To save state in localstorage
export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('state', serializedState);
    } catch {
      // ignore write errors
    }
};

export const throttler = ( theFunction, throttleLimit ) => {
    let canThrottle = true;

    return function() {
        const self = this;
        const args = arguments;

        if( canThrottle ) {
            theFunction.apply( self, args );
            canThrottle = false;
        }
    
        setTimeout( function() {
            canThrottle = true;
        }, throttleLimit );
    }
}

export const getComputed = ( item, itemKeys, sliceLimit ) => {
    return itemKeys.slice(0, sliceLimit).reduce((acc, k, i) => {
        const total = itemKeys.slice(0, i + 1).reduce((t, i) => {
          t = t + item[i].amount;
          return t;
        }, 0)
        const localItem = item[k];
        acc[k] = { ...localItem, total };
        return acc;
    }, {});
    
}

export const getTotal = ( item, itemKeys ) => {
    return itemKeys.reduce((t, i) => {
        if (t < item[i].total) {
          return item[i].total;
        }
        else {
          return t;
        }
    }, 0);
}


