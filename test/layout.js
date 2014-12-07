'use strict';

var should = require('should');
var Handlebars = require('handlebars');
var _ = require('lodash');

var helpers = require('..');
Handlebars.registerHelper(helpers('layouts'));


describe('extend/block/content', function() {
  describe('{{extend testingPartial}}', function() {
    it('should return the original partial with html escapement', function() {
      Handlebars.registerPartial('testingPartial', '<div>yes</div>');
      Handlebars.compile('{{extend "testingPartial"}}')().should.equal('&lt;div&gt;yes&lt;/div&gt;');
    });
  });

  describe('{{{extend testingPartial}}}', function() {
    it('should return the original partial without escapement', function() {
      Handlebars.registerPartial('testingPartial', '<div>yes</div>');
      Handlebars.compile('{{{extend "testingPartial"}}}')().should.equal('<div>yes</div>');
    });
  });

  describe('{{#extend testingPartial}}', function() {
    it('should return the original partial', function() {
      Handlebars.registerPartial('testingPartial', '<div>yes</div>');
      Handlebars.compile('{{#extend "testingPartial"}}{{/extend}}')().should.equal('<div>yes</div>');
    });
  });

  describe('{{#extend testingPartial}}{{#block "target"}}', function() {
    it('should return the original partial', function() {
      Handlebars.registerPartial('testingPartial', '<div>{{#block "target"}}yes{{/block}}</div>');
      Handlebars.compile('{{#extend "testingPartial"}}{{/extend}}')().should.equal('<div>yes</div>');
    });
  });

  describe('{{#extend testingPartial}}{{block "target"}}', function() {
    it('should return an empty block if no content is defined', function() {
      Handlebars.registerPartial('testingPartial', '<div>{{block "target"}}</div>');
      var template = Handlebars.compile('{{#extend "testingPartial"}}{{/extend}}');
      template().should.equal('<div></div>');
    });

    it('should return escaped replacement data', function() {
      Handlebars.registerPartial('testingPartial', '<div>{{block "target"}}</div>');
      var template = Handlebars.compile('{{#extend "testingPartial"}}{{#content "target"}}<br>{{/content}}{{/extend}}');
      template().should.equal('<div>&lt;br&gt;</div>');
    });
  });

  describe('{{#extend testingPartial}}{{{block "target"}}}', function() {
    it('should return non-escaped replacement data', function() {
      Handlebars.registerPartial('testingPartial', '<div>{{{block "target"}}}</div>');
      var template = Handlebars.compile('{{#extend "testingPartial"}}{{#content "target"}}<br>{{/content}}{{/extend}}');
      template().should.equal('<div><br></div>');
    });
  });

  describe('{{#content testingPartial}}', function() {
    it('should replace content by default', function() {
      Handlebars.registerPartial('testingPartial', '<div>{{#block "target"}}yes{{/block}}</div>');
      var template = Handlebars.compile('{{#extend "testingPartial"}}{{#content "target"}}no{{/content}}{{/extend}}');
      template().should.equal('<div>no</div>');
    });

    it('should append new content when defined', function() {
      Handlebars.registerPartial('testingPartial', '<div>{{#block "target"}}yes{{/block}}</div>');
      var template = Handlebars.compile('{{#extend "testingPartial"}}{{#content "target" mode="append"}}no{{/content}}{{/extend}}');
      template().should.equal('<div>yesno</div>');
    });

    it('should prepend new content when defined', function() {
      Handlebars.registerPartial('testingPartial', '<div>{{#block "target"}}yes{{/block}}</div>');
      var template = Handlebars.compile('{{#extend "testingPartial"}}{{#content "target" mode="prepend"}}no{{/content}}{{/extend}}');
      template().should.equal('<div>noyes</div>');
    });

    it('should replace content when defined', function() {
      Handlebars.registerPartial('testingPartial', '<div>{{#block "target"}}yes{{/block}}</div>');
      var template = Handlebars.compile('{{#extend "testingPartial"}}{{#content "target" mode="replace"}}no{{/content}}{{/extend}}');
      template().should.equal('<div>no</div>');
    });
  });

  describe('{{#block}}} within {{#block}}', function() {
    it('should handle replacement of the inner block only', function() {
      Handlebars.registerPartial('testingPartial', '<div>{{#block "title"}}<h1>{{#block "titleText"}}Title{{/block}}</h1>{{/block}}</div>');
      var template = Handlebars.compile('{{#extend "testingPartial"}}{{#content "titleText"}}Hello my baby, hello my honey, hello my rag time gal.{{/content}}{{/extend}}');
      template().should.equal('<div><h1>Hello my baby, hello my honey, hello my rag time gal.</h1></div>');
    });

    it('should handle replacement of the outer block only', function() {
      Handlebars.registerPartial('testingPartial', '<div>{{#block "title"}}<h1>{{#block "titleText"}}Title{{/block}}</h1>{{/block}}</div>');
      var template = Handlebars.compile('{{#extend "testingPartial"}}{{#content "title"}}Hello my baby, hello my honey, hello my rag time gal.{{/content}}{{/extend}}');
      template().should.equal('<div>Hello my baby, hello my honey, hello my rag time gal.</div>');
    });
  });
});
