<<<<<<< HEAD
#!/usr/bin/env node
var argv = require("optimist").usage("git-release-notes [<options>] <since>..<until> <template>")
.options("f", {
	"alias": "file"
})
.options("p", {
	"alias": "path",
	"default": process.cwd()
})
.options("t", {
	"alias": "title",
	"default": "(.*)"
})
.boolean("i")
.alias("i", "ignore-case")
.options("m", {
	"alias": "meaning",
	"default": ['type']
})
.options("b", {
	"alias": "branch",
	"default": "master"
})
.options("s", {
	"alias": "script"
})
.boolean("c")
.alias("c", "merge-commits")
.describe({
	"f": "Configuration file",
	"p": "Git project path",
	"t": "Commit title regular expression",
	"i": "Ignore case of title's regular expression",
	"m": "Meaning of capturing block in title's regular expression",
	"b": "Git branch, defaults to master",
	"s": "External script to rewrite the commit history",
	"c": "Only use merge commits"
})
.boolean("version")
.check(function (argv) {
	if (argv._.length == 2) {
		return true;
	}
	throw "Invalid parameters, please specify an interval and the template";
})
.argv;

=======
>>>>>>> 46c40382bd3e6b053dd0c556edb2750141dde162
var git = require("./lib/git");
var ejs = require("ejs");
var debug = require("debug")("release-notes:cli");
var fileSystem = require('./lib/file-system');
var processCommits = require('./lib/process').processCommits;
var dateFnsFormat = require('date-fns/format');

module.exports = function module(cliOptions, positionalRange, positionalTemplate) {
	return fileSystem.resolveTemplate(positionalTemplate).then(function (template) {
		return fileSystem.resolveOptions(cliOptions).then(function (options) {
			debug("Running git log in '%s' on branch '%s' with range '%s'", options.p, options.b, positionalRange);
			return git.log({
				branch: options.b,
<<<<<<< HEAD
				range: argv._[0],
=======
				range: positionalRange,
>>>>>>> 46c40382bd3e6b053dd0c556edb2750141dde162
				title: options.i ? new RegExp(options.t, 'i') : new RegExp(options.t),
				meaning: Array.isArray(options.m) ? options.m: [options.m],
				cwd: options.p,
				mergeCommits: options.c,
				additionalOptions: Array.isArray(options.o) ? options.o : [options.o]
			}).then(function (commits) {
				return processCommits(options, commits, positionalRange);
			}).then(function (data) {
				return render(positionalRange, template, data);
			});
		});
<<<<<<< HEAD
	}
});

function getOptions (callback) {
	if (argv.f) {
		debug("Trying to read configuration file '%s'", argv.f);
		fs.readFile(argv.f, function (err, data) {
			if (err) {
				console.error("Unable to read configuration file\n" + err.message);
			} else {
				var options;
				try {
					var stored = JSON.parse(data);
					options = {
						b: stored.b || stored.branch || argv.b,
						t: stored.t || stored.title || argv.t,
						i: stored.i || stored.ignoreCase || argv.i,
						m: stored.m || stored.meaning || argv.m,
						p: stored.p || stored.path || argv.p,
						c: stored.c || stored.mergeCommits || argv.c
					};
				} catch (ex) {
					console.error("Invalid JSON in configuration file");
				}
				if (options) {
					callback(options);
				}
			}
		});
	} else {
		callback(argv);
	}
}

function postProcess(templateContent, commits) {
	debug("Got %d commits", commits.length);
	if (commits.length) {
		if (argv.s) {
			var externalScriptPath = argv.s;
			try {
				var externalScript = require(externalScriptPath);
			} catch (ex) {
				debug("Exception while reading external script '%s': '%s'", externalScriptPath, ex.message);
				console.error('Unable to read external script');
				process.exit(7);
			}
			debug("Trying to run the external script");
			var inputData;
			var outputData;
			try {
				inputData = {
					commits: commits,
					range: argv._[0],
					dateFnsFormat: dateFnsFormat,
					debug: require("debug")("release-notes:externalscript")
				};
				externalScript(inputData, function (data) {
					outputData = data;
					render(templateContent, data);
				});
				debug("Waiting for external script to call the callback");
			} catch (ex) {
				debug("Exception while running external script '%s'", ex.message);
				debugData("Input data passed to the external script `%s`", JSON.stringify(inputData, null, '  '));
				debugData("Output data received from the external script `%s`", outputData ? JSON.stringify(outputData, null, '  ') : '');
				console.error('Error while processing external script', ex);
				process.exit(8);
			}
		} else {
			debug("Rendering template without post processing");
			render(templateContent, { commits: commits });
		}
	} else {
		console.error('No commits in the specified range');
		process.exit(6);
	}
}
=======
	});
};
>>>>>>> 46c40382bd3e6b053dd0c556edb2750141dde162

function render(range, templateContent, data) {
	debug("Rendering template");
	return ejs.render(templateContent, Object.assign({
		range: range,
		dateFnsFormat: dateFnsFormat
	}, data));
}
