function clickFunction(commit) {
    //alert(`Commit ${commit.hash} selected`);
    const msg = info.find((el) => {
        if (el.hash === commit.sha1) {
            return el;
        }
    })
    if (msg !== null) {
        $('#modal-title').text(msg.title)
        $('#commit-description').text(msg.label)
        $('#show-details').modal('show')
        //alert(msg.label);
    } else {
        alert(`Not found ${commit.sha1}`)
    }
}
