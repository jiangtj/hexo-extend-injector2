'use strict';

const { Cache } = require('hexo-util');
const { mergeWith } = require('lodash');

module.exports = class Param extends Cache {
  // deeply copy sources to object
  mergeHelper(object, sources) {
    return mergeWith(object, sources, (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return srcValue;
      }
    });
  }
  // over config if key is exist
  deeplyMerge(id, value) {
    const sources = this.get(id);
    if (typeof value === 'function') value = value(sources);
    value = this.mergeHelper(sources, value);
    this.set(id, value);
    return value;
  }
  // not over config if key is exist
  deeplyApply(id, value) {
    const sources = this.get(id);
    if (typeof value === 'function') value = value(sources);
    value = this.mergeHelper(value, sources);
    this.set(id, value);
    return value;
  }
};
