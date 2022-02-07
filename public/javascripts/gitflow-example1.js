$('document').ready(() => {

/***********************
 *  CUSTOM TEMPLATES   *
 ***********************/
	const options = {
        template: GitgraphJS.templateExtend("blackarrow", {
            colors: ["red", "blue", "orange"],
            orientation: "vertical-reverse",
            // reverseArrow: false,
            }),
        };

	// Get the graph container HTML element.
	const graphContainer = document.getElementById("graph-container");

	// Instantiate the graph.
	const gitgraph = GitgraphJS.createGitgraph(graphContainer, {
		template: 'blackarrow', 
		orientation: "vertical-reverse",
		reverseArrow: false,
		colors: ["red", "blue", "orange"],
		branchLabelOnEveryCommit: true, 
	});
	const commitOptions = {
		onMessageClick: clickFunction,
		onClick: clickFunction,
		style: {
			//spacingY: -30,
			// dot: {
			//     size: 10,
			//     //strokeColor: "#000000",
			//     //strokeWidth: 4
			// },
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
		}
	}

	/************************
 	* BRANCHES AND COMMITS *
 	************************/
	let index = 0;

	const master = gitgraph.branch({
		name:"master",
		style: {
			color: "#000000",
			reverseArrow: false,
			lineWidth: 3,
			spacingX: 160,
			mergeStyle: "straight",
			labelFont: "normal 10pt Arial",
			labelRotation: 0,
			lineDash: [5, 3],
		},
	});
	master.commit({ subject: "Initial Starting Point",
		hash: info[index].hash,
		hashAbbrev: info[index].hash.substring(0,5),
		tag: "v1.0.0",
		...commitOptions
	});
	index++;

	// create development branch
	const develop = gitgraph.branch({
		name: "develop",
		});
	develop.commit({
		subject: "",
		hash: info[index].hash,
		hashAbbrev: info[index].hash.substring(0,5),
		...commitOptions
		});

	// create support hotfix branch
	const support_10x = master.branch({
		name: "support/v1.0.1",
	});
	support_10x.commit({
		message: "Start v1.0.1-rc Release Candidate builds",
		tag: "v1.0.1-rc",
		tagColor: 'gray',
		messageColor: "red"
	})//.commit(bugFixCommit);

})
	
// // Create branch named "master"







// support_10x.merge(master, {message: "Merge 1.0.1 into master and Push to production", messageColor: "red",})

// // create another support hotfix branch
// var support_20x = gitGraph.branch({
// 	parentBranch: master,
// 	name: "support/v1.0.2",
// 	column: supportCol
// });

// // create another support hotfix branch
// var support_30x = gitGraph.branch({
// 	parentBranch: master,
// 	name: "support/v1.0.3",
// 	column: support2Col
// });

// support_20x.commit({
// 	message: "Start v1.0.2-rc Release Candidate builds",
// 	tag: "v1.0.2-rc",
// 	tagColor: 'gray',
// 	messageColor: "red",
// }).commit(bugFixCommit);

// support_30x.commit({
// 	message: "Start v1.0.3-rc Release Candidate builds",
// 	tag: "v1.0.3-rc",
// 	tagColor: 'gray',
// 	messageColor: "red",
// }).commit(bugFixCommit);

// support_20x.merge(master, {message: "Merge 1.0.2 into master and Push to production", messageColor: "red",})
// master.merge(support_30x, {message: "Merge master into 1.0.3 branch",
// 	messageColor: "blue",
// 	messageFont: "normal 14pt Arial",
// 	messageDisplay: "bold"
// })
// support_30x.merge(master, {message: "Merge 1.0.3 into master and Push to production", messageColor: "red",})

// /*develop.commit({
// 	messageDisplay: false
// });*/

// /*master.commit({
// 	messageDisplay: false
// });*/

// var feature1 = gitGraph.branch({
// 	parentBranch: develop,
// 	name: "feature/1",
// 	column: featureCol
// });
// var feature2 = gitGraph.branch({
// 	parentBranch: develop,
// 	name: "feature/2",
// 	column: featureCol2
// });
// feature1.commit({
// 	message: "A feature to go into v2.0.0",
// 	messageColor: "green"})
// 	.commit({messageDisplay: false});
// feature1.merge(develop, {messageColor: "green"});


// feature2.commit({
// 	message: "Another feature to go into v2.0.0",
// 	messageColor: "green"}).commit({messageDisplay: false});
// develop.merge(feature2, {messageColor: "green"})
// feature2.merge(develop, {messageColor: "green"});

// var release_100 = gitGraph.branch({
// 	parentBranch: develop,
// 	name: "release/v2.0.0",
// 	column: releaseCol
// });
// master.merge(release_100, {message: "Merge master into release branch",
// 		messageColor: "blue",
// 		messageFont: "normal 14pt Arial",
// 		messageDisplay: "bold"
// })

// release_100.commit({
// 	message: "Start v2.0.0-rc Release Candidate builds",
// 	tag: "v2.0.0-rc",
// 	tagColor: 'gray'
// });
// develop.commit({
// 	messageDisplay: false
// });
// release_100.commit(stabilizationCommit);

// release_100.merge(master, {
// 	dotStrokeWidth: 10,
// 	message: "Release v2.0.0 tagged",
// 	tag: "v2.0.0"
// });
// master.merge(develop,
// 	{ messageColor: "blue",
// 	messageFont: "normal 14pt Arial",
// 	messageDisplay: "bold"});



/*gitGraph.branch("HotFix 1", {parentBranch: "master"})

// Add few commits on master
gitGraph.commit("My second commit", {"parentCommit": "Initial commit"}).commit("Add awesome feature");*/
