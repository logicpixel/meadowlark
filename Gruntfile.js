module.exports = function(grunt){
    //load plugins
    [
      "grunt-cafe-mocha",
      "grunt-contrib-jshint",
      "grunt-exec"
    ].each(function(tast){
      grunt.leadNpmTasks(task);
    });

    //configure plugins
    grunt.initConfig({
      cafemocha: {
        all: { src: 'public/qa/tests-*.js', options:{ui: 'tdd'}}
      },
      jshint: {
        app: ["meadowlark.js", "public/js/**/*.js", "lib/**/*.js"],
        qa: ["Gruntfile.js", "public/qa/**/*.js", "qa/**/*.js"]
      },
      exec: {
        blc: {cmd: "blc http://localhost:3000"}
      }
    });
    grunt.registerTask("default", ["cafemocha", "jshint", "exec"])
}
