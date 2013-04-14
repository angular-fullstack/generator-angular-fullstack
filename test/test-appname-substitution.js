/*global describe, before, it, beforeEach */
'use strict';
var fs = require('fs');
var assert = require('assert');
var path = require('path');
var util = require('util');
var generators = require('yeoman-generator');
var helpers = require('yeoman-generator').test;


describe('Angular generator template mechanism', function () {
    //TODO: Add underscore dependency and test with _.camelize(folderName);
    var folderName = 'UpperCaseBug';
    var angular;

    beforeEach(function (done) {
        var deps = [
            '../../app',
            '../../common',
            '../../controller',
            '../../main', [
                helpers.createDummyGenerator(),
                'karma:app'
            ]
        ];
        helpers.testDirectory(path.join(__dirname, folderName), function (err) {
            if (err) {
                done(err);
            }
            angular = helpers.createGenerator('angular:app', deps);
            angular.options['skip-install'] = true;
            done();
        });
    });

    it('should generate the same appName in every file', function (done) {
        var expectedAppName = folderName + 'App';
        var expected = [
            'app/scripts/app.js',
            'app/scripts/controllers/main.js',
            'app/index.html',
            'test/spec/controllers/main.js'
        ];
        helpers.mockPrompt(angular, {'bootstrap': 'Y', 'compassBoostrap': 'Y'});

        angular.run({}, function () {
            // Check if all files are created for the test
            helpers.assertFiles(expected);

            // read JS Files
            var app_js = fs.readFileSync('app/scripts/app.js', 'utf8');
            var main_js = fs.readFileSync('app/scripts/controllers/main.js', 'utf8');
            var main_test_js = fs.readFileSync('test/spec/controllers/main.js', 'utf8');

            // Test JS Files
            var regex_js = new RegExp('module\\(\'' + expectedAppName + '\'');
            assert.ok(regex_js.test(app_js), 'app.js template using a wrong appName');
            assert.ok(regex_js.test(main_js), 'main.js template using a wrong appName');
            assert.ok(regex_js.test(main_test_js), 'controller spec template using a wrong appName');

            // read HTML file
            var index_html = fs.readFileSync('app/index.html', 'utf8');

            // Test HTML File
            var regex_html = new RegExp('ng-app=\"' + expectedAppName + '\"');
            assert.ok(regex_html.test(index_html), 'index.html template using a wrong appName');
            done();
        });
    });
});
