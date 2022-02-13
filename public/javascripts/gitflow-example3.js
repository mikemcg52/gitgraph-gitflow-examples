$('document').ready(() => {

	/***********************
	 *  CUSTOM TEMPLATES   *
	 ***********************/

	const myTemplateConfig = {
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

	const graphConfig = new GitGraph.Template({
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

	const bugFixCommit = {
		messageColor: "red",
		messageAuthorDisplay: false,
		messageBranchDisplay: false,
		messageHashDisplay: false,
		message: "Bug fix commit(s)"
	};

	const stabilizationCommit = {
		messageAuthorDisplay: false,
		messageBranchDisplay: false,
		messageHashDisplay: false,
		message: "Release stabilization commit(s)"
	};

	const featureCol = 0;
	const featureCol2 = 1;
	const developCol = 2;
	const releaseCol = 3;
	const supportCol = 5;
	const support2Col = 6;
	const masterCol = 4;

	const myTemplate = new GitGraph.Template(myTemplateConfig);

	/***********************
	 *    INITIALIZATION   *
	 ***********************/

	const config = {
		template: graphConfig, // could be: "blackarrow" or "metro" or `myTemplate` (custom Template object)
		reverseArrow: false, // to make arrows point to ancestors, if displayed
		orientation: "vertical",
		author: "",
		//mode: "compact" // special compact mode: hide messages & compact graph
	};
	const gitGraph = new GitGraph(config);

	/************************
	 * BRANCHES AND COMMITS *
	 ************************/

	// Create branch named "master"
	const master = gitGraph.branch({name: "master",
		column: masterCol});

	// Commit on HEAD Branch which is "master"
	gitGraph.commit({
		message: "Initial Starting Point",
		tag: "v1.0.0",
		sha1: info[0].hash,
		onClick: clickFunction,
	});

	// create development branch
	const develop = gitGraph.branch({
		parentBranch: master,
		name: "develop",
		column: developCol
	});
	develop.commit({
		messageDisplay: false,
		sha1: info[1].hash,
		onClick: clickFunction,
	});

	// create support hotfix branch
	const support_10x = gitGraph.branch({
		parentBranch: master,
		name: "support/v1.0.1",
		column: supportCol
	});

	support_10x.commit({
		message: "Start v1.0.1-rc Release Candidate builds",
		//tag: "v1.0.1-rc",
		tagColor: 'gray',
		messageColor: "red",
		sha1: info[2].hash,
		onClick: clickFunction,
	});

	develop.commit({
		message: "Feature #1 - partial commit",
		messageColor: "green",
		sha1: info[16].hash,
		onClick: clickFunction,
	})
		.commit({
			messageDisplay: false,
			sha1: info[16].hash,
			onClick: clickFunction,
		});

	support_10x.commit({	// TODO customize this message
		sha1: info[2].hash,
		onClick: clickFunction,
		...bugFixCommit
	});

	support_10x.merge(master, {
		message: "Merge 1.0.1 into master and Push to production", 
		messageColor: "red",
		sha1: info[13].hash,
		tag: "v1.0.1",
		onClick: clickFunction,
	})

	// create another support hotfix branch
	const support_20x = gitGraph.branch({
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
		//tag: "v1.0.2-rc",
		tagColor: 'gray',
		messageColor: "red",
		sha1: info[4].hash,
		onClick: clickFunction,
	}).commit({  // TODO customize this message
		sha1: info[4].hash,
		onClick: clickFunction,
		...bugFixCommit
	});

	support_30x.commit({
		message: "Start v1.0.3-rc Release Candidate builds",
		//tag: "v1.0.3-rc",
		tagColor: 'gray',
		messageColor: "red",
		sha1: info[12].hash,
		onClick: clickFunction,
	}).commit({  // TODO customize this message
		sha1: info[12].hash,
		onClick: clickFunction,
		...bugFixCommit
	});

	develop.commit({
		message: "Feature #2 - partial commit",
		messageColor: "green",
		sha1: info[16].hash,
		onClick: clickFunction,
	}).commit({
		messageDisplay: false,
		sha1: info[16].hash,
		onClick: clickFunction,
	});

	support_20x.merge(master, {
		message: "Merge 1.0.2 into master and Push to production", 
		messageColor: "red",
		sha1: info[10].hash,
		tag: "v1.0.2",
		onClick: clickFunction,
	})
	master.merge(support_30x, {message: "Merge master into 1.0.3 branch",
		messageColor: "blue",
		messageFont: "normal 14pt Arial",
		messageDisplay: "bold",
		sha1: info[11].hash,
		onClick: clickFunction,
	})
	support_30x.merge(master, {
		message: "Merge 1.0.3 into master and Push to production", 
		messageColor: "red",
		sha1: info[10].hash,
		tag: "1.0.3",
		onClick: clickFunction,
	})

	develop.commit({
		messageDisplay: false,
		sha1: info[16].hash,
		onClick: clickFunction,
	})
		.commit({
			message: "Feature #2 - complete",
			messageColor: "green",
			sha1: info[16].hash,
			onClick: clickFunction,
		});
	//feature1.merge(develop, {messageColor: "green"});


	develop.commit({
		messageDisplay: false,
		sha1: info[16].hash,
		onClick: clickFunction,
	}).commit({
		message: "Feature #1 - complete",
		messageColor: "green",
		sha1: info[16].hash,
		onClick: clickFunction,
	});
	//develop.merge(feature2, {messageColor: "green"})
	//feature2.merge(develop, {messageColor: "green"});

	var release_100 = gitGraph.branch({
		parentBranch: develop,
		name: "release/v2.0.0",
		column: releaseCol
	});
	release_100.commit({
		message: "Start v2.0.0 Release Candidate process",
		// tag: "v2.0.0-rc",
		tagColor: 'gray',
		sha1: info[18].hash,
		onClick: clickFunction,
	});

	master.merge(release_100, {
		message: "Merge master into release branch",
		messageColor: "blue",
		messageFont: "normal 14pt Arial",
		messageDisplay: "bold",
		sha1: info[17].hash,
		onClick: clickFunction,
	})

	release_100.commit({
		messageDisplay: false,
		// tag: "v2.0.0-rc",
		tagColor: 'gray',
		sha1: info[19].hash,
		onClick: clickFunction,
	});
	develop.commit({
		messageDisplay: false,
		sha1: info[23].hash,
		onClick: clickFunction,
	});
	release_100.commit({
		sha1: info[19].hash,
		onClick: clickFunction,
		...stabilizationCommit
	});

	release_100.merge(master, {
		dotStrokeWidth: 10,
		message: "Release v2.0.0 tagged",
		tag: "v2.0.0",
		sha1: info[14].hash,
		onClick: clickFunction,
	});
	master.merge(develop, { 
		messageColor: "blue",
		messageFont: "normal 14pt Arial",
		messageDisplay: "bold",
		sha1: info[15].hash,
		onClick: clickFunction,
	});

})