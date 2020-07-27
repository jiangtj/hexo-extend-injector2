'use strict';

module.exports = {

  /**
   * If true, don't inject default points(headbegin headend bodybegin bodyend)
   */
  disable_default_point: false,

  /**
   * If helper used, it will set injector_point_<key> to true
   */
  injector_point_headbegin: false,
  injector_point_headend: false,
  injector_point_bodybegin: false,
  injector_point_bodyend: false,

  /**
   * If helper used, it will set injector_point_<key> to true
   */
  load_next_plugin: true,

  /**
   * Js bundler config, use terser
   */
  js: {
    enable: true,
    path: 'js/injector.js',
    hash: false,
    options: {}
  },

  /**
   * CSS bundler config, use clean css
   */
  css: {
    enable: true,
    path: 'css/injector.css',
    options: {}
  }

};
