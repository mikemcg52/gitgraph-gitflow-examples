$('document').ready(() => {

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
			},
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
			},
		},
		/*merge: {
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
				color: "blue",
				font: "normal 14pt Arial",
				displayAuthor: false,
				displayBranch: false,
				displayHash: false,
			}
		},*/
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
	var developCol = 2;
	var releaseCol = 3;
	var supportCol = 5;
	var support2Col = 6;
	var masterCol = 4;

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

	let index = 0;
	// Create branch named "master"
	var master = gitGraph.branch({name: "master",
		column: masterCol});

	// Commit on HEAD Branch which is "master"
	gitGraph.commit({
		message: "Initial Starting Point",
		tag: "v1.0.0",
		sha1: info[index].hash,
		onClick: clickFunction,
	});
	index++;

	// create development branch
	var develop = gitGraph.branch({
		parentBranch: master,
		name: "develop",
		column: developCol
	});
	develop.commit({
		messageDisplay: false,
		sha1: info[index].hash,
		onClick: clickFunction,
	});
	index++;

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
		messageColor: "red",
		sha1: info[index].hash,
		onClick: clickFunction,
	}).commit({sha1: info[index].hash,
		onClick: clickFunction,
		...bugFixCommit
	});

	support_10x.merge(master, {
		message: "Merge 1.0.1 into master and Push to production", 
		messageColor: "red",
		sha1: info[index].hash,
		onClick: clickFunction,
	})
	index++;

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
		sha1: info[index].hash,
		onClick: clickFunction,
	}).commit({sha1: info[index].hash,
		onClick: clickFunction,
		...bugFixCommit
	});

	support_30x.commit({
		message: "Start v1.0.3-rc Release Candidate builds",
		tag: "v1.0.3-rc",
		tagColor: 'gray',
		messageColor: "red",
		sha1: info[index].hash,
		onClick: clickFunction,
	}).commit({sha1: info[index].hash,
		onClick: clickFunction,
		...bugFixCommit
	});

	support_20x.merge(master, {
		message: "Merge 1.0.2 into master and Push to production", 
		messageColor: "red",
		sha1: info[index].hash,
		onClick: clickFunction,
	})
	master.merge(support_30x, {message: "Merge master into 1.0.3 branch",
		messageColor: "blue",
		messageFont: "normal 14pt Arial",
		messageDisplay: "bold",
		sha1: info[index].hash,
		onClick: clickFunction,
	})
	support_30x.merge(master, {
		message: "Merge 1.0.3 into master and Push to production", 
		messageColor: "red",
		sha1: info[index].hash,
		onClick: clickFunction,
	})
	index++;
	/*develop.commit({
		messageDisplay: false
	});*/

	/*master.commit({
		messageDisplay: false
	});*/

	var feature1 = gitGraph.branch({
		parentBranch: develop,
		name: "feature/1",
		column: featureCol
	});
	var feature2 = gitGraph.branch({
		parentBranch: develop,
		name: "feature/2",
		column: featureCol2
	});
	feature1.commit({
		message: "A feature to go into v2.0.0",
		messageColor: "green",
		sha1: info[index].hash,
		onClick: clickFunction,
	})
		.commit({
			messageDisplay: false,
			sha1: info[index].hash,
			onClick: clickFunction,
		});
	feature1.merge(develop, {messageColor: "green"});


	feature2.commit({
		message: "Another feature to go into v2.0.0",
		messageColor: "green",
		sha1: info[index].hash,
		onClick: clickFunction,
	}).commit({
		messageDisplay: false,
		sha1: info[index].hash,
		onClick: clickFunction,
	});
	develop.merge(feature2, {
		messageColor: "green",
		sha1: info[index].hash,
		onClick: clickFunction,
	})
	feature2.merge(develop, {
		messageColor: "green",
		sha1: info[index].hash,
		onClick: clickFunction,
	});

	var release_100 = gitGraph.branch({
		parentBranch: develop,
		name: "release/v2.0.0",
		column: releaseCol
	});
	master.merge(release_100, {
		message: "Merge master into release branch",
		messageColor: "blue",
		messageFont: "normal 14pt Arial",
		messageDisplay: "bold",
		sha1: info[index].hash,
		onClick: clickFunction,
	})

	release_100.commit({
		message: "Start v2.0.0-rc Release Candidate builds",
		tag: "v2.0.0-rc",
		tagColor: 'gray',
		sha1: info[index].hash,
		onClick: clickFunction,
	});
	develop.commit({
		messageDisplay: false
	});
	release_100.commit({
		sha1: info[index].hash,
		onClick: clickFunction,
		...stabilizationCommit
	});

	release_100.merge(master, {
		dotStrokeWidth: 10,
		message: "Release v2.0.0 tagged",
		tag: "v2.0.0",
		sha1: info[index].hash,
		onClick: clickFunction,
	});
	master.merge(develop,
		{ messageColor: "blue",
		messageFont: "normal 14pt Arial",
		messageDisplay: "bold",
		sha1: info[index].hash,
		onClick: clickFunction,
	});


	function clickFunction(commit) {
		//alert(`Commit ${commit.hash} selected`);
		const msg = info.find((el) => {
			if (el.hash === commit.sha1) {
				return el;
			}
		})
		if (msg !== null) {
			alert(msg.label);
		} else {
			alert(`Not found ${commit.sha1}`)
		}
	}
	/*gitGraph.branch("HotFix 1", {parentBranch: "master"})

	// Add few commits on master
	gitGraph.commit("My second commit", {"parentCommit": "Initial commit"}).commit("Add awesome feature");*/
})
