
var files = require('./files');

module.exports = function(grunt) {

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Project Configuration
  grunt.initConfig({

    paths: require('./paths'),

    // identify package.json
    pkg: grunt.file.readJSON('package.json'),

    // Compile Jade -> HTML (app/frontend/jade/angular/** -> public/views)
    jade: {
      html: {
        files: {
          "public/views": ["<%= paths.jadeDir %>/**/*.jade"]
        },
        options: {
          basePath: "<%= paths.jadeDir %>",
          client: false,
          pretty: true
        }
      }
    },

    // Compile Sass -> CSS (app/frontend/sass/** -> public/css)
    compass: {
      dev: {
        options: {
          sassDir: "<%= paths.sassDir %>",
          cssDir: "<%= paths.cssDir %>/tmp"
        }
      }
    },

    // Concatenate lib & src files
    concat: {
      deps: {
        files: {
          '<%= paths.depsDir %>/dependencies.js': files["deps"]
        },
        options: {
          banner: "'use strict';\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        }
      },
      js: {
        files: {
          '<%= paths.jsDir %>/application.js': files["angular"]
        },
        options: {
          banner: "'use strict';\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        }
      },
      css: {
        files: {
          "<%= paths.cssDir %>/application.css": files["css"]
        }
      },
      build: {
        files: { '<%= paths.depsDir %>/dependencies.min.js': files["deps_min"] },
        options: {
          banner: "'use strict';\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        }
      }
    },

    sass: {
      bootstrap: {
        options: { style: 'expanded' },
        files: { '<%= paths.cssDir %>/bootstrap.css': '<%= paths.libDir %>/sass-bootstrap/lib/bootstrap.scss' }
      },
      min: {
        options: { style: 'compressed' },
        files: { '<%= paths.cssDir %>/bootstrap.min.css': '<%= paths.libDir %>/sass-bootstrap/lib/bootstrap.scss' }
      },
      theme: {
        options: { style: 'expanded' },
        files: { '<%= paths.cssDir %>/bootstrap-theme.css': '<%= paths.libDir %>/sass-bootstrap/lib/_theme.scss' }
      },
      theme_min: {
        options: { style: 'compressed' },
        files: { '<%= paths.cssDir %>/bootstrap-theme.min.css': '<%= paths.libDir %>/sass-bootstrap/lib/_theme.scss' }
      }
    },

    copy: {
      bootstrap: {
        files: [{
          expand: false,
          src: ['<%= paths.libDir %>/sass-bootstrap/dist/css/*'],
          dest: 'public/css/',
          filter: 'isFile', // includes files in path
        }]
      }
    },

    // Start up mongoDB in background with async: true
    shell: {
      mongo: {
        command: 'mongod &',
        async: true
      }
    },

    watch: {
      compile_jade: { // compile to ['public/views']
        files: ['<%= paths.jadeDir %>/**/*.jade'],
        tasks: ['jade:html'],
        options: {
          spawn: false, // compile files as they change (see NOTE below)
          force: true
        }
      },
      concat_js: { // concat JS files to ['public/js']
        files: ['<%= paths.angularDir %>/**/*.js'],
        tasks: ['concat:js', 'karma:unit', 'karma:e2e'],
        options: {
          force: true
        }
      },
      compile_scss: { // compile the directory to ['public/css/tmp'], then concat
        files: ['<%= paths.sassDir %>/**/*.scss'],
        tasks: ['compass'],
        options: {
          force: true
        }
      },
      concat_css: { // application.css -> ['public/css']
        files: ['<%= paths.cssDir %>/tmp/**/*.css'],
        tasks: ['concat:css'],
        options: {
          force: true
        }
      },
      jasmine_node: {
        files: ['<%= paths.serverDir %>/**/*.js', '<%= paths.serverSpecs %>/**/*.js'],
        tasks: ["jasmine_node"],
        options: { force: true }
      }
    },

    // Start the server with nodemon wrapper
    nodemon: {
      dev: {
        options: {
          file: 'server.js',
          args: ['NODE_ENV=development'],
          ignoredFiles: [
            'README.md',
            'node_modules/**',
            '.DS_Store',
            'app/client/specs/**',
            'app/server/specs/**'
          ],
          watchedFolders: ['<%= paths.publicDir %>', '<%= paths.serverDir %>'],
          watchedExtensions: ['.js', '.html', '.css'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },

    // Run ongoing tasks in parallel
    concurrent: {
      tasks: ['nodemon', 'karma:unit', 'karma:e2e', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },

    jshint: {
      options: {
        curly: false,
        eqeqeq: true,
        eqnull: true,
        laxcomma: true,
        undef: false,
        maxdepth: 2,
      },
      server: files['server'],
      client: {
        options: {
          browser: true,
          globals: {
            jQuery: true,
            angular: true
          }
        },
        files: { src: files['angular'] }
      }
    },

    jasmine_node: {
      specNameMatcher: "./spec", // load only specs containing specNameMatcher
      projectRoot: "<%= paths.root %>",
      specFolders: '<%= paths.serverSpecsDir %>',
      requirejs: false,
      forceExit: false
    },

    karma: {
      unit: { configFile: 'karma.conf.js' },
      e2e: { configFile: 'karma-e2e.conf.js' }
    },

    cssmin: {
      build: {
        options: {
          banner: '<%= pkg.name %> [v<%= pkg.version %>]',
          report: 'min'
        },
        files: { 'public/css/application.min.css': files['css'] }
      }
    },

    // TODO imagemin: {

    // },

    uglify: {
      options: {
        mangle: false,
        report: 'min',
        banner: '<%= pkg.name %> [v<%= pkg.version %>]'
      },
      angular: {
        files: { 'public/js/application.min.js': files['angular'] }
      }
    },

    clean: ['<%= paths.cssDir %>/tmp', '<%= paths.depsDir %>/dependencies.js']

  });


  // NOTE: Only compile watched files as needed   [partially broken...]
  var changedFiles = Object.create(null);
  var onChange = grunt.util._.debounce(function() {
    grunt.config(['jade', 'html'], Object.keys(changedFiles));
    changedFiles = Object.create(null);
  }, 200);
  grunt.event.on('watch', function(action, filepath) {
    changedFiles[filepath] = action;
    onChange();
  });

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', [
    'shell:mongo',
    'jshint',
    'jade:html',
    'compass',
    'concat:deps', 'concat:js', 'concat:css',
    'sass:bootstrap',
    'jshint',
    'jasmine_node',
    'concurrent'
  ]);

  grunt.registerTask('server', [
    'shell:mongo',
    'jshint',
    'jade:html',
    'compass',
    'concat:deps', 'concat:js', 'concat:css',
    'sass:bootstrap', 'sass:min',
    'jshint',
    'jasmine_node',
    'nodemon',
    'watch:compile_scss', 'watch:concat_css'
  ]);

  grunt.registerTask('noTest', [
    'shell:mongo',
    'jshint',
    'jade:html',
    'compass',
    'concat:deps', 'concat:js', 'concat:css',
    'sass:bootstrap', 'sass:min',
    'jshint',
    'clean:dev',
    'concurrent:karma:unit', 'concurrent:karma:e2e'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'jasmine_node',
    'jasmine:clientSpecs',
    'concurrent:karma:unit', 'concurrent:karma:e2e'
  ]);

  grunt.registerTask('citest', [
    'jshint',
    'jasmine_node',
    'jasmine:clientSpecs',
    'concurrent:karma:unit', 'concurrent:karma:e2e',
    'watch:jshint', 'watch:jasmine_node', 'watch:karma'
  ]);

  grunt.registerTask('build', [
    'jade:html',
    'compass',
    // 'imagemin', // TODO
    'sass:min', 'sass:theme_min',
    'cssmin',
    'uglify',
    'clean'
  ]);
};
