'use strict';

class Injector {
  constructor() {
    this._store = {};
    this._run = {};
  }

  clean() {
    this._run = {};
  }

  get(entry, options = {context: {}}) {
    entry = this.formatKey(entry);
    const ctx = options.context;
    const _storeEntries = Array.from(this._store[entry] || []);
    const _runEntries = Array.from(this._run[entry] || []);
    const list = () => _storeEntries.concat(_runEntries)
      .filter(item => item.predicate(ctx))
      .sort((a, b) => a.priority - b.priority);
    const rendered = () => list().map(item => {
      const renderItem = Object.assign({}, item);
      if (typeof item.value === 'function') {
        renderItem.value = item.value(ctx);
      }
      return renderItem;
    });
    const text = () => rendered().map(item => item.value).join('');
    return {list, rendered, text};
  }

  getSize(entry) {
    entry = this.formatKey(entry);
    const storeLen = this._store[entry] ? this._store[entry].length : 0;
    const runLen = this._run[entry] ? this._run[entry].length : 0;
    return storeLen + runLen;
  }

  register(entry, value, predicate = () => true, priority = 10, isRun) {
    if (!entry) throw new TypeError('entry is required');
    entry = this.formatKey(entry);

    if (typeof value !== 'object') {
      value = { value };
    }
    const options = Object.assign({ predicate, priority, isRun }, value);

    const store = options.isRun ? this._run : this._store;
    store[entry] = store[entry] || [];

    if (typeof options.predicate === 'string') {
      options.predicate = this.is(options.predicate);
    }

    store[entry].push(options);
    return this;
  }

  is(...types) {
    return locals => {
      for (const type of types) {
        if (type === 'home' && locals.page.__index) return true;
        if (type === 'post' && locals.page.__post) return true;
        if (type === 'page' && locals.page.__page) return true;
        if (type === 'archive' && locals.page.archive) return true;
        if (type === 'category' && locals.page.category) return true;
        if (type === 'tag' && locals.page.tag) return true;
        if (locals.page[type]) return true;
      }
      return false;
    };
  }

  formatKey(entry) {
    return entry.replace(/[-| |_]/g, '').toLowerCase();
  }
}

module.exports = Injector;
