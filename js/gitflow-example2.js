/***********************
 *  CUSTOM TEMPLATES   *
 ***********************/

var myTemplateConfig = {
	colors: ["#F00", "#0F0", "#00F"], // branches colors, 1 per column
	branch: {
		lineWidth: 8,
		// Dash segments, see:
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
		lineDash: [5, 3],
		spacingX: 50
	},
	commit: {
		spacingY: -80,
		dot: {
			size: 12,
			lineDash: [4]
		},
		message: {
			displayAuthor: false,
			displayBranch: false,
			displayHash: false,
			font: "normal 12pt Arial"
		},
		shouldDisplayTooltipsInCompactMode: false, // default = true
		tooltipHTMLFormatter: function (commit) {
			return  commit.message;
		}
	}
};

var graphConfig = new GitGraph.Template({
	colors: [ "#9993FF", "#47E8D4", "#6BDB52", "#F85BB5", "#FFA657", "#F85BB5" ],
	branch: {
		color: "#000000",
		lineWidth: 3,
		spacingX: 60,
		mergeStyle: "straight",
		showLabel: true, // display branch names on graph
		labelFont: "normal 10pt Arial",
		labelRotation: 0
	},
	commit: {
		spacingY: -30,
		dot: {
			size: 8,
			strokeColor: "#000000",
			strokeWidth: 4
		},
		tag: {
			font: "normal 10pt Arial",
			color: "yellow"
		},
		message: {
			color: "black",
			font: "normal 12pt Arial",
			displayAuthor: false,
			displayBranch: false,
			displayHash: false,
		}
	},

	arrow: {
		size: 8,
		offset: 3
	}
});

var bugFixCommit = {
	messageColor: "red",
	messageAuthorDisplay: false,
	messageBranchDisplay: false,
	messageHashDisplay: false,
	message: "Bug fix commit(s)"
};

var stabilizationCommit = {
	messageAuthorDisplay: false,
	messageBranchDisplay: false,
	messageHashDisplay: false,
	message: "Release stabilization commit(s)"
};

var featureCol = 0;
var featureCol2 = 1;
var featureCol3 = 2;
var featureCol4 =3;
var release1Col = 4;
var release2Col = 5;
var supportCol = 7;
var support2Col = 8;
var masterCol = 6;

var myTemplate = new GitGraph.Template(myTemplateConfig);

/***********************
 *    INITIALIZATION   *
 ***********************/

var config = {
	template: graphConfig, // could be: "blackarrow" or "metro" or `myTemplate` (custom Template object)
	reverseArrow: false, // to make arrows point to ancestors, if displayed
	orientation: "vertical",
	author: "",
	//mode: "compact" // special compact mode: hide messages & compact graph
};
var gitGraph = new GitGraph(config);
/*	var gitgraph = new GitGraph({
		template: "blackarrow",
		reverseArrow: false,
		orientation: "horizontal",
		//mode: "compact"
	});*/

/************************
 * BRANCHES AND COMMITS *
 ************************/

// Create branch named "master"
var master = gitGraph.branch({name: "master",
	column: masterCol});

// Commit on HEAD Branch which is "master"
gitGraph.commit({
	message: "Initial Starting Point",
	tag: "v1.0.0",
	sha1: "",
});

// create development branch
var release1 = gitGraph.branch({
	parentBranch: master,
	name: "release 2.0.0",
	column: release1Col
});
release1.commit({
	messageDisplay: false
});

// create support hotfix branch
var support_10x = gitGraph.branch({
	parentBranch: master,
	name: "support/v1.0.1",
	column: supportCol
});

support_10x.commit({
	message: "Start v1.0.1-rc Release Candidate builds",
	tag: "v1.0.1-rc",
	tagColor: 'gray',
	messageColor: "red"
}).commit(bugFixCommit);

support_10x.merge(master, {message: "Merge into master and Push to production", messageColor: "red",})

// create another support hotfix branch
var support_20x = gitGraph.branch({
	parentBranch: master,
	name: "support/v1.0.2",
	column: supportCol
});
// create another support hotfix branch
var support_30x = gitGraph.branch({
	parentBranch: master,
	name: "support/v1.0.3",
	column: support2Col
});
support_20x.commit({
	message: "Start v1.0.2-rc Release Candidate builds",
	tag: "v1.0.2-rc",
	tagColor: 'gray',
	messageColor: "red",
}).commit(bugFixCommit);

support_30x.commit({
	message: "Start v1.0.3-rc Release Candidate builds",
	tag: "v1.0.3-rc",
	tagColor: 'gray',
	messageColor: "red",
}).commit(bugFixCommit);

support_20x.merge(master, {message: "Merge into master and Push to production", messageColor: "red",})

master.merge(support_30x, {message: "Merge master into 1.0.3 branch",
	messageColor: "blue",
	messageFont: "normal 14pt Arial",
	messageDisplay: "bold"
})
support_30x.merge(master, {message: "Merge 1.0.3 into master and Push to production", messageColor: "red",})

/*develop.commit({
	messageDisplay: false
});*/

/*master.commit({
	messageDisplay: false
});*/
release1.commit({
	messageDisplay: false
});

var feature1 = gitGraph.branch({
	parentBranch: release1,
	name: "feature/1",
	column: featureCol
});
var feature2 = gitGraph.branch({
	parentBranch: release1,
	name: "feature/2",
	column: featureCol2
});
feature1.commit({
	message: "A feature to go into v2.0.0",
	messageColor: "green"})
	.commit({messageDisplay: false});
feature1.merge(release1, {messageColor: "green"});

var release2 = gitGraph.branch({
	parentBranch: master,
	name: "release 3.0.0",
	column: release2Col
})
release2.commit({messageDisplay: false})

var feature3 = gitGraph.branch({
	parentBranch: release2,
	name: "feature/3",
	column: featureCol3
});
var feature4 = gitGraph.branch({
	parentBranch: release2,
	name: "feature/4",
	column: featureCol4
});
feature3.commit({
	message: "A feature to go into v3.0.0",
	messageColor: "brown"})
	.commit({messageDisplay: false});
feature3.merge(release2, {messageColor: "brown"});

feature2.commit({
	message: "Another feature to go into v2.0.0",
	messageColor: "green"}).commit({messageDisplay: false});

release1.merge(feature2, {messageColor: "green"})
feature2.merge(release1, {messageColor: "green"});

feature4.commit({
	message: "Another feature to go into v3.0.0",
	messageColor: "brown"}).commit({messageDisplay: false});
feature4.merge(release2, {messageColor: "brown"});

/*var release_100 = gitGraph.branch({
	parentBranch: release1,
	name: "release/v2.0.0",
	column: release1Col
});*/
master.merge(release1, {message: "Merge master into release branch",
		messageColor: "blue",
		messageFont: "normal 14pt Arial",
		messageDisplay: "bold"
})

release1.commit({
	message: "Start v2.0.0-rc Release Candidate builds",
	tag: "v2.0.0-rc",
	tagColor: 'gray'
});
/*develop.commit({
	messageDisplay: false
});*/
release1.commit(stabilizationCommit);

release1.merge(master, {
	dotStrokeWidth: 10,
	message: "Release v2.0.0 tagged",
	tag: "v2.0.0"
});
master.merge(release2,
	{ message: "Merge master into release branch",
		messageColor: "blue",
	messageFont: "normal 14pt Arial",
	messageDisplay: "bold"});

release2.commit({
	message: "Start v3.0.0-rc Release Candidate builds",
	tag: "v3.0.0-rc",
	tagColor: 'gray'
});
/*develop.commit({
	messageDisplay: false
});*/
release2.commit(stabilizationCommit);

release2.merge(master, {
	dotStrokeWidth: 10,
	message: "Release v3.0.0 tagged",
	tag: "v3.0.0"
});

/*gitGraph.branch("HotFix 1", {parentBranch: "master"})

// Add few commits on master
gitGraph.commit("My second commit", {"parentCommit": "Initial commit"}).commit("Add awesome feature");*/
