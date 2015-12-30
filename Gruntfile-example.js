module.exports = function (grunt){
    grunt.initConfig ({
        pkg: grunt.file.readJSON('package.json'),
 	env:{
	    dist:"build",
            index:"demo.html",
            src:"app"
	},
        clean: ['<%= env.dist %>/' ], 
        copy: {
            main: {
                expand: true,
                cwd: '<%= env.src %>/' ,
                src: ['**', '!js/**', '!lib/**', '!**/*.css','!bower_components/**','!components/**','js/config.js'],
                dest: '<%= env.dist %>/'
            },
            gridlogo: {
                cwd:'<%= env.src %>/bower_components/angular-ui-grid',
                src: ['ui-grid.svg',
                      'ui-grid.ttf',
                      'ui-grid.woff',
                      'ui-grid.eot'],
                dest: '<%= env.dist %>/css/',
                expand: true
            }            
        },
        rev: {
            files: {
                src: ['<%= env.dist %>/**/*.{js,css}']
            }
        }, 
        useminPrepare: {
            options: {
                dest: '<%= env.dist %>'
            },            
            html: '<%= env.src+"/"+env.index %>'           
        },
 
        usemin: {
            options: {
                dest: '<%= env.dist %>'
            },            
            html: ['<%= env.dist+"/"+env.index %>']
        },
        less: {
         development: {
           files: {
             "app/css/my.css": "app/less/app.less"
           }
         }/*,
         production: {
           options: {
             paths: ["assets/css"],
             plugins: [
               new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
               new (require('less-plugin-clean-css'))(cleanCssOptions)
             ],
             modifyVars: {
               imgPath: '"http://mycdn.com/path/to/images"',
               bgColor: 'red'
             }
           },
           files: {
             "path/to/result.css": "path/to/source.less"
           }
         }*/
       },
        uglify: {
            options: {
                report: 'min',
                mangle: false
            }
        },
        'http-server': { 
            'beta': {
                root: 'build',
                port: 8000, 
                host: "127.0.0.1",
                cache: 20,
                showDir : true,
                autoIndex: true, 
                // server default file extension 
                ext: "html", 
                // run in parallel with other tasks 
                runInBackground: false 
            },
            'e2e': {
                root: 'build',
                port: 8000, 
                host: "127.0.0.1",
                cache: 20,
                showDir : true,
                autoIndex: true, 
                // server default file extension 
                ext: "html", 
                // run in parallel with other tasks 
                runInBackground: true
            }            
        },        
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                /*options: {
                    files: ['test/unit/*.js']
                }*/              
            }
        },
        protractor: {
          options: {
            keepAlive: false, // If false, the grunt process stops when the test fails. 
            noColor: false, // If true, protractor will not use colors in its output. 
          },
          e2e: {   
            options: {
              configFile: "e2e-tests/protractor.conf.js", // Target-specific config file 
            }
          },
        },
        shell: {
            options: {
               stdout: true
            },
           'protractorStart': {
               command: 'node /usr/lib/node_modules/protractor/bin/webdriver-manager start&',
                options: {
                    stdout: false,
                    stderr: false,
                    async:true
                }
            },
           'protractorStop': {
               command: 'node /usr/lib/node_modules/protractor/bin/webdriver-manager stop&',
                options: {
                    stdout: false,
                    stderr: false,
                    async: true
                }
            }            
       }
    });
 
 

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  grunt.registerTask('build', [ 'clean','copy:main','less','useminPrepare', 'concat', 'uglify', 'cssmin', 'rev', 'usemin']);
  grunt.registerTask('beta', [ 'build', 'http-server:beta']);
  grunt.registerTask('unit', [ 'karma']);
  grunt.registerTask('e2e', [ 'build', 'http-server:e2e','shell:protractorStart','protractor','shell:protractorStop']);
  
};
