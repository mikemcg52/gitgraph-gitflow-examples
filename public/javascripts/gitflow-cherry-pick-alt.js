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

	const config = {
		template: graphConfig, // could be: "blackarrow" or "metro" or `myTemplate` (custom Template object)
		reverseArrow: false, // to make arrows point to ancestors, if displayed
		orientation: "vertical",
		author: "",
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
	// first feature branch
	const feature1 = gitGraph.branch({
		parentBranch: master,
		name: "feature/1",
		column: featureCol
	});
	feature1.commit({
		message: "First independent feature",
		messageColor: "green",
		sha1: info[5].hash,
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
	}).commit({
		sha1: info[2].hash,
		onClick: clickFunction,
		...bugFixCommit
	});

	support_10x.merge(master, {
		message: "Merge into master and Push to production",
		messageColor: "red",
		sha1: info[13].hash,
		tag: "v1.0.1",
		onClick: clickFunction,
	})
	// second feature
	const feature2 = gitGraph.branch({
		parentBranch: master,
		name: "feature/2",
		column: featureCol2
	});
	feature2.commit({
		message: "Second independent feature",
		messageColor: "green",
		onClick: clickFunction,
		sha1: info[5].hash
	});
	const feature3 = gitGraph.branch({
		parentBranch: master,
		name: "feature/3",
		column: featureCol3
	});
	feature3.commit({
		message: "Third independent feature",
		messageColor: "brown",
		onClick: clickFunction,
		sha1: info[5].hash
	});
	// create another support hotfix branch
	const support_20x = gitGraph.branch({
		parentBranch: master,
		name: "support/v1.0.2",
		column: supportCol
	});
	// create another support hotfix branch
	const support_30x = gitGraph.branch({
		parentBranch: master,
		name: "support/v1.0.3",
		column: support2Col
	});
	support_20x.commit({
		message: "Hotfix branch created",
		//tag: "v1.0.2-rc",
		tagColor: 'gray',
		messageColor: "red",
		sha1: info[4].hash,
		onClick: clickFunction,
	}).commit({
		sha1: info[4].hash,
		onClick: clickFunction,
		...bugFixCommit
	});

	support_30x.commit({
		message: "Additional hotfix branch created",
		//tag: "v1.0.3-rc",
		tagColor: 'gray',
		messageColor: "red",
		sha1: info[12].hash,
		onClick: clickFunction,
	}).commit({
		sha1: info[12].hash,
		onClick: clickFunction,
		...bugFixCommit
	});

	support_20x.merge(master, {
		message: "Merge into master and Push to production",
		messageColor: "red",
		sha1: info[10].hash,
		tag: "v1.0.2",
		onClick: clickFunction,
	})
	master.merge(support_30x, {
		message: "Merge master into 1.0.3 branch",
		messageColor: "blue",
		messageFont: "normal 14pt Arial",
		messageDisplay: "bold",
		sha1: info[11].hash,
		onClick: clickFunction,
	})
	const feature4 = gitGraph.branch({
		parentBranch: master,
		name: "feature/4",
		column: featureCol4
	});
	support_30x.merge(master, {
		message: "Merge 1.0.3 into master and Push to production",
		messageColor: "red",
		sha1: info[10].hash,
		tag: "v1.0.3",
		onClick: clickFunction,
	})
	// create release branch
	const release1 = gitGraph.branch({
		parentBranch: master,
		name: "release 1",
		column: release1Col
	});
	release1.commit({
		messageDisplay: false,
		sha1: info[24].hash,
		onClick: clickFunction,
	});

	feature4.commit({
		message: "Fourth independent feature",
		messageColor: "brown",
		onClick: clickFunction,
		sha1: info[5].hash
	})

	feature1.commit({
		messageDisplay: false,
		sha1: info[21].hash,
		onClick: clickFunction,
	});

	feature1.merge(release1, {
		messageColor: "green",
		onClick: clickFunction,
		sha1: info[25].hash
	});

	feature3.commit({
		messageDisplay: false,
		onClick: clickFunction,
		sha1: info[21].hash
	});
	feature3.merge(release1, {
		messageColor: "brown",
		onClick: clickFunction,
		sha1: info[25].hash
	});

	feature2.commit({
		messageDisplay: false,
		onClick: clickFunction,
		sha1: info[21].hash
	});

	/*release1.merge(feature2, {
		messageColor: "green",
		onClick: clickFunction,
		sha1: info[16].hash
	})*/


	feature4.commit({
		messageDisplay: false,
		onClick: clickFunction,
		sha1: info[21].hash

	});

	/*var release_100 = gitGraph.branch({
		parentBranch: release1,
		name: "release/v2.0.0",
		column: release1Col
	});*/
	master.merge(release1, {message: "Merge master into release branch",
			messageColor: "blue",
			messageFont: "normal 14pt Arial",
			messageDisplay: "bold",
			onClick: clickFunction,
			sha1: info[17].hash
	})

	/*release1.commit({
		message: "Start v2.0.0-rc Release Candidate builds",
		//tag: "v2.0.0-rc",
		tagColor: 'gray',
		onClick: clickFunction,
		sha1: info[19].hash
	});
	/!*develop.commit({
		messageDisplay: false
	});*!/
	release1.commit({
		onClick: clickFunction,
		sha1: info[19].hash,
		...stabilizationCommit
	});*/

	release1.merge(master, {
		dotStrokeWidth: 10,
		message: "Release v2.0.0 tagged",
		tag: "v2.0.0",
		onClick: clickFunction,
		sha1: info[14].hash
	});
	const release2 = gitGraph.branch({
		parentBranch: master,
		name: "release 2",
		column: release2Col
	})
	release2.commit({
		messageDisplay: false,
		sha1: info[24].hash,
		onClick: clickFunction,
	})
	feature2.merge(release2, {
		messageColor: "green",
		onClick: clickFunction,
		sha1: info[25].hash
	});
	feature4.merge(release2, {
		messageColor: "brown",
		onClick: clickFunction,
		sha1: info[25].hash
	});
	/*release2.merge(feature4,{
		messageColor: "green",
		onClick: clickFunction,
		sha1: info[17].hash
	})*/
	master.merge(release2, {
		message: "Merge master into release branch",
		messageColor: "blue",
		messageFont: "normal 14pt Arial",
		messageDisplay: "bold",
		onClick: clickFunction,
		sha1: info[17].hash
	});

	/*release2.commit({
		message: "Start v3.0.0-rc Release Candidate builds",
		//tag: "v3.0.0-rc",
		tagColor: 'gray',
		onClick: clickFunction,
		sha1: info[19].hash
	});

	release2.commit({
		onClick: clickFunction,
		sha1: info[19].hash,
		...stabilizationCommit
	});*/

	release2.merge(master, {
		dotStrokeWidth: 10,
		message: "Release v3.0.0 tagged",
		tag: "v3.0.0",
		onClick: clickFunction,
		sha1: info[14].hash
	});

})
