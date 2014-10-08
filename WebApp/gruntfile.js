module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        files: {
          'static/uglify/app.min.js': ['static/concat/built.js']
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['static/js/vendor/*.js', 'static/js/*.js'],
        dest: 'static/concat/built.js',
      },
    },
    compass: {                  // Task
      dist: {                   // Target
        options: {              // Target options
          sassDir: 'static/sass/',
          cssDir: 'static/stylesheets/',
          config: 'config.rb',
        }
      },
    },
    watch: {
      css: {
        files: 'static/sass/*.scss',
        tasks: ['compass'],
        options: {
          livereload: true,
        },
      },
      js: {
        files: ['static/js/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
          livereload: true,
        },
      },
      dont: {
        files: ['other/stuff/*'],
        tasks: ['dostuff'],
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'compass', 'watch']);
};