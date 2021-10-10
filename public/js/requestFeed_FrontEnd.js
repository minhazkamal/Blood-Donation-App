function getPosts(offset) {
    if(!offset) {
        offset = 0;
    }

    fetch('http://localhost:3940/request-feed/list?' + 'offset=' + offset)
    .then(response => response.json())
    .then(data => loadPostIntoFeed(data));
}

function loadPostIntoFeed(postsArray) {
    // console.log(postsArray);
    let html = "";
    postsArray.forEach(function (post, index) {
        // html needs to be added
        html+=`<div class="row">`
        html+= `<div class="card-02">`
        html+= `<div class="profile-card">`
        html+= `<a href="/profile/view" target="blank">`
        html+= `<div class="profile">`
        html+= `<img src="/profile/avatar.png" alt="" style="height: 25%; width: 25%; border-radius: 50%;">`
        html+= `<div class="name">ABCD XYZ</div>`
        html+= `<div class="blood-group">A+</div>`
        html+= `<div class="blood-required">2 bag(s)</div>`
        html+= `<div class="blood-required">Approx. Donation Date: </div>`
        html+= `</div>`
        html+= `</a>`
        html+= `</div>` 
        html+= `<div class="info">`
        html+= `<div class="place">Contact:</div>`
        html+= `<div class="place">Place:</div>`
        html+= `<div class="add-requirements">Additional Requirements:</div>`
        html+= `<div class="complications">Complications:</div>`
        html+= `</div>`
        html+= `<div class="btn">`
        html+= `<a href="/link" target="blank"><span class="view-profile-btn">View Details</span></a>`
        html+= `<button class="respond-btn" type="submit">Respond</button>`
        html+= `</div>`
        html+= `</div>`
        html+= `</div>`
    });

    document.querySelector('.left-col').insertAdjacentHTML('beforeend', html);
}

window.onscroll = function () {
if(this.innerHeight + this.pageYOffset >= document.body.scrollHeight) {
    let postsLength = document.querySelectorAll('.card-02').length;
    getPosts(postsLength);
}
}

getPosts();
