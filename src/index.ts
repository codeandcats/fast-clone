const windowOrGlobal = Function('return this')();

(function (root) {

  /* istanbul ignore next */
  if (typeof exports !== 'undefined') {
    /* istanbul ignore next */
    if (typeof module !== 'undefined' && module && module.exports) {
      exports = module.exports = clone;
    }
    exports.clone = clone;
  } else {
    /* istanbul ignore next */
    root.clone = clone;
  }

  function clone(value: any) {
    const type = typeof value;
    switch (type) {
      case 'object':
        // null and undefined
        if (value == null) {
          return value;
        }

        let result;

        if (value instanceof Date) {
          result = new Date();
          result.setTime(value.getTime());
          return result;
        }
        else if (value instanceof RegExp) {
          result = newRegExp(value);
          return result;
        }

        result = JSON.parse(JSON.stringify(value));
        fixTypes(value, result);
        return result;

      default:
        return value;
    }
  }

  function fixPropertyValue(original: any, copy: any, key: number | string) {
    const originalValue = original[key];
    const originalType = typeof originalValue;

    switch (originalType) {
      case 'object':
        if (originalValue instanceof Date) {
          var newValue = new Date();
          newValue.setTime(originalValue.getTime());
          copy[key] = newValue;
        }
        else if (originalValue instanceof RegExp) {
          copy[key] = newRegExp(originalValue);
        }
        else if (originalValue == null) {
          copy[key] = originalValue;
        }
        else {
          fixTypes(originalValue, copy[key]);
        }
        break;

      case 'number':
        if (isNaN(originalValue)) {
          copy[key] = NaN;
        }
        else if (originalValue == Infinity) {
          copy[key] = Infinity;
        }
        break;

      default:
        break;
    }
  }

  function fixTypes(original: any, copy: any) {
    if (original instanceof Array) {
      for (let index = 0; index < original.length; index++) {
        fixPropertyValue(original, copy, index);
      }
    }
    else {
      let keys = Object.getOwnPropertyNames(original);
      keys.forEach(function (key) {
        fixPropertyValue(original, copy, key);
      });
    }
  }

  function newRegExp(value: RegExp) {
    const regexpText = String(value);
    const slashIndex = regexpText.lastIndexOf('/');
    return new RegExp(regexpText.slice(1, slashIndex), regexpText.slice(slashIndex + 1));
  }

})(windowOrGlobal);
