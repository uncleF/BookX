// Gruntfile for the BookX Project

var PROJECT           = 'BookX';          // Project Name
var LANGUAGE          = 'ru';             // Language

var DEVELOPMENT_DIR   = 'dev';            // Development
var BUILD_DIR         = 'build';          // Bild
var BOOK_DIR          = 'book';           // Book
var IMAGES_DIR        = 'images';         // Content Images
var CHAPTERS_DIR      = 'chapters';       // Chapters
var RESOURCES_DIR     = 'res';            // Resources (CSS, JavaScript, Fonts, etc.)
var TEMPLATES_DIR     = 'templates';      // Templates
var COMPONENTS_DIR    = 'components';     // Components

var INDEX_PAGE        = 'index.html';     // Index Page

var CSS_IMAGES_DIR    = 'images';         // CSS Images (Sprites, Icons, etc.)

var SASS_DIR          = 'sass';           // Sass
var CSS_DIR           = 'css';            // CSS
var CSS_FILENAME      = 'styles';         // CSS Filename

module.exports = function(grunt) {

  var project = {
    init: function() {
      var developmentDirCompiled = DEVELOPMENT_DIR + '/';
      var resourcesDirCompiled = developmentDirCompiled + RESOURCES_DIR + '/';
      var config = {
        name: PROJECT,
        language: LANGUAGE,
        dir: developmentDirCompiled,
        chapters: developmentDirCompiled + CHAPTERS_DIR +  '/',
        images: developmentDirCompiled + IMAGES_DIR + '/',
        index: INDEX_PAGE,
        res: {
          dir: resourcesDirCompiled,
          templates: {
            dir: resourcesDirCompiled + TEMPLATES_DIR + '/',
            comp: resourcesDirCompiled + TEMPLATES_DIR + '/' + COMPONENTS_DIR + '/'
          },
          images: {
            dir: resourcesDirCompiled + CSS_IMAGES_DIR + '/'
          },
          css: {
            dir: resourcesDirCompiled + CSS_DIR + '/',
            sass: resourcesDirCompiled + SASS_DIR + '/',
            filename: CSS_FILENAME
          }
        },
        build: {
          dir: BUILD_DIR + '/'
        },
        book: {
          dir: BOOK_DIR + '/'
        }
      };
      return config;
    }
  }.init();

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    htmlhint: {
      options: {
        'htmlhintrc': '.htmlhintrc'
      },
      htmlHint: {
        cwd: project.dir,
        src: ['*.html'],
        expand: true
      }
    },
    scsslint: {
      scssLint: {
        cwd: project.res.css.sass,
        src: ['**/*.{scss,sass}'],
        expand: true
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      cssLint: {
        cwd: project.res.css.dir,
        src: ['*.css', '!*-IE.css'],
        expand: true
      }
    },
    csscss: {
      options: {
        shorthand: false,
        verbose: true
      },
      csscssTest: {
        cwd: project.res.css.dir,
        src: ['*.css'],
        expand: true
      }
    },
    colorguard: {
      files: {
        cwd: project.res.css.dir,
        src: ['*.css'],
        expand: true
      }
    },

    sass: {
      options: {
        sourceMap: true,
        precision: 5
      },
      generateCSS: {
        cwd: project.res.css.sass,
        src: ['**/*.{scss,sass}'],
        dest: project.res.css.dir,
        ext: '.css',
        expand: true
      }
    },
    autoprefixer: {
      options: {
        map: true,
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'Explorer >= 7'],
        cascade: false
      },
      prefixCSS: {
        cwd: project.res.css.dir,
        src: ['*.css', '!*-IE.css'],
        dest: project.res.css.dir,
        expand: true
      }
    },

    'string-replace': {
      build: {
        options: {
          replacements: [{
            pattern: /@tx-title/gi,
            replacement: project.name
          }, {
            pattern: /@tx-language/gi,
            replacement: project.language
          }, {
            pattern: /(?:<span data-dev-note=".*?">)(.*)(?:<\/span>)/gi,
            replacement: '$1'
          }, {
            pattern: /\sdata-dev-note=".*?"/gi,
            replacement: ''
          }, {
            pattern: new RegExp(project.res.css.dir.replace(project.dir, '') + project.res.css.filename + '.css', 'gi'),
            replacement: project.res.css.dir.replace(project.dir, '') + project.res.css.filename + '.min.css'
          }, {
            pattern: /(?:\s|\t)*.*tx-debug.*(?:\r?\n|\r)/gi,
            replacement: ''
          }]
        },
        files: {
          './': [project.build.dir + '*.html']
        }
      },
      cssComments: {
        options: {
          replacements: [{
            pattern: /\/\* line \d*, .* \*\/(?:\r?\n|\r)*/g,
            replacement: ''
          }, {
            pattern: /\/\*# sourceMappingURL(?:.|\t|\s|\r?\n|\r)*?\*\//gi,
            replacement: ''
          }, {
            pattern: /.media \-sass\-debug\-info(?:.|\t|\s|\r?\n|\r)*?\}\}/gi,
            replacement: ''
          }, {
            pattern: /\/\*\*\* uncss>.*\*\*\*\/(?:\r?\n|\r)*/g,
            replacement: ''
          }, {
            pattern: /\*\s(?:.)*\*\/(?:\r?\n|\r)*$/g,
            replacement: ''
          }, {
            pattern: /\*\s(?:.)*\*\/(?:\r?\n\t*|\r\t*)*\//g,
            replacement: ''
          }, {
            pattern: /(?:\r?\n|\r)*\/$/g,
            replacement: ''
          }, {
            pattern: /\/\*(?:.)*(?:\r?\n|\r){4}/g,
            replacement: ''
          }, {
            pattern: /\{(?:\r?\n|\r)\s*\/\*/g,
            replacement: '{\n\n  /*'
          }, {
            pattern: /\}(?:\r?\n|\r)\}/g,
            replacement: '}\n\n}'
          }]
        },
        files: {
          './': [project.res.css.dir + '*.css', '!' + project.res.css.dir + '*.min.css']
        }
      }
    },

    uncss: {
      cssOptimize: {
        files: {
          cssMinFiles: function() {
            var cssMinFilesObject = {};
            cssMinFilesObject[project.res.css.dir + project.res.css.filename + '.css'] = project.dir + '*.html';
            return cssMinFilesObject;
          }
        }.cssMinFiles()
      }
    },
    csscomb: {
      options: {
        config: '.csscombrc'
      },
      cssSort: {
        cwd: project.res.css.dir,
        src: ['*.css'],
        dest: project.res.css.dir,
        expand: true
      }
    },
    cssc: {
      options: grunt.file.readJSON('.csscrc'),
      cssOptimize: {
        cwd: project.res.css.dir,
        src: ['*.css'],
        dest: project.res.css.dir,
        ext: '.min.css',
        expand: true
      }
    },
    cssmin: {
      cssMin: {
        cwd: project.res.css.dir,
        src: ['*.min.css'],
        dest: project.res.css.dir,
        expand: true
      }
    },

    processhtml: {
      options: {
        includeBase: project.res.templates.comp,
        commentMarker: '@tx-process',
        recursive: true
      },
      templates: {
        cwd: project.res.templates.dir,
        src: ['*.html', '!* copy.html', '!* - Copy.html'],
        dest: project.dir,
        expand: true
      }
    },
    htmlmin: {
      options: grunt.file.readJSON('.htmlminrc'),
      cleanup: {
        cwd: project.build.dir,
        src: ['*.html'],
        dest: project.build.dir,
        expand: true
      }
    },
    prettify: {
      options: {
        config: '.jsbeautifyrc'
      },
      formatBuild: {
        cwd: project.build.dir,
        src: ['*.html'],
        dest: project.build.dir,
        expand: true
      },
      formatDev: {
        cwd: project.dir,
        src: ['*.html'],
        dest: project.dir,
        expand: true
      }
    },

    imagemin: {
      images: {
        cwd: project.dir,
        src: ['**/*.{png,jpg,gif}', '!**/tx-*.*', '!**/tx/*.*'],
        dest: project.dir,
        expand: true
      },
      meta: {
        cwd: project.build.dir,
        src: ['*.{png,jpg,gif}'],
        dest: project.build.dir,
        expand: true
      }
    },
    svgmin: {
      options: {
        plugins: [{
          removeViewBox: false
        }]
      },
      images: {
        cwd: project.dir,
        src: ['**/*.svg', '!**/fonts/**/*.svg', '!**/tx-*.*', '!**/tx/*.*'],
        dest: project.dir,
        expand: true
      },
      meta: {
        cwd: project.build.dir,
        src: ['*.{svg}'],
        dest: project.build.dir,
        expand: true
      }
    },

    clean: {
      res: [project.res.css.dir],
      build: [project.build.dir],
      book: [project.book.dir],
      templates: [project.res.templates.dir + '*.html'],
    },
    cleanempty: {
      options: {
        noJunk: true
      },
      build: {
        src: [project.build.dir + '**/*']
      }
    },
    copy: {
      build: {
        cwd: project.dir,
        src: ['**/*.*', '!**/chapters/**', '!**/templates/**', '!**/sass/**', '!**/*.map', '!**/**-dev/**', '!**/tx-*.*', '!**/tx/**'],
        dest: project.build.dir,
        expand: true
      }
    },
    compress: {
      book: {
        options: {
          mode: 'zip',
          archive: project.name + '.book.zip'
        },
        cwd: project.book.dir,
        src: ['**'],
        dest: '.',
        extDot: 'last',
        expand: true
      }
    },

    watch: {
      options: {
        spawn: false
      },
      html: {
        files: [project.res.templates.dir + '**/*.html'],
        tasks: ['processhtml']
      },
      images: {
        files: [project.res.images.dir + '**/*.{png,jpg,gif,svg}'],
        tasks: ['sass', 'autoprefixer', 'processhtml']
      },
      sass: {
        files: [project.res.css.sass + '**/*.{scss,sass}'],
        tasks: ['sass', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [project.dir + '**/*.{html,png,jpg,gif,svg}', project.res.css.dir + '**/*.css']
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true,
        limit: 4
      },
      projectWatch: ['watch:html', 'watch:images', 'watch:sass', 'watch:livereload']
    },

  });

  grunt.registerTask('chapters', 'Chapters', function() {
    var template = grunt.file.read(project.res.templates.comp + '_chapterTemplate.html');
    grunt.file.recurse(project.chapters, function(path, root, sub, filename) {
      var file;
      var text = grunt.file.read(path);
      var textLength = text.length;
      var lastCharacter = text.substring(textLength - 1, textLength);
      if (lastCharacter.match(/(?:\r?\n|\r)/)) {
        text = text.slice(0, -1);
      }
      file = template.replace(/<!-- @tx-process:chapter --><!-- \/@tx-process -->/, text);
      grunt.file.write(project.res.templates.dir + filename, file);
    });
  });

  grunt.registerTask('reminder', 'Reminder', function() {
    var list = grunt.file.readJSON('reminders.json').reminders;
    if (list.length > 0) {
      grunt.log.writeln('\nDon\'t Forget to Check:'['magenta']);
      list.forEach(function(value) {
        grunt.log.writeln('✔'['green'] + ' ' + value);
      });
    }
  });

  grunt.registerTask('quality', [
    'htmlhint',
    'scsslint',
    'csslint',
    'csscss',
    'colorguard',
  ]);

  grunt.registerTask('images', [
    'imagemin:images',
    'svgmin:images'
  ]);

  grunt.registerTask('process-html', [
    'processhtml'
  ]);

  grunt.registerTask('process-css', [
    'sass',
    'autoprefixer',
    'uncss',
    'csscomb',
    'string-replace:cssComments',
    'cssc',
    'cssmin:cssMin'
  ]);

  grunt.registerTask('watch-project', [
    'concurrent'
  ]);

  grunt.registerTask('compile', [
    'clean:res',
    'images',
    'chapters',
    'process-html',
    'process-css'
  ]);

  grunt.registerTask('build', [
    'compile',
    'clean:build',
    'clean:book',
    'copy:build',
    'string-replace:build',
    'htmlmin',
    'prettify',
    'cleanempty:build',
    'clean:templates',
    'reminder'
  ]);

  grunt.registerTask('compress-book', [
    'compress:book'
  ]);

};
