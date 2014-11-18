module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({
        nodewebkit: {
            options: {
                platforms: ['win','osx'],
                buildDir: './webkitbuilds', // Where the build version of my node-webkit app is saved
            },
            src: [ './src/*', './src/**/*' ] // Your node-webkit app
        }
    });

    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.registerTask('default', ['nodewebkit']);
};