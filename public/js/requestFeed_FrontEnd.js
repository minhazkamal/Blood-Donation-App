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
        html+= `<a href="/view-profile/${post.post_by_id}" target="blank">`
        html+= `<div class="profile">`
        html+= `<img src="/profile/${post.profile_photo}" alt="" style="height: 25%; width: 25%; border-radius: 50%;">`
        html+= `<div class="name">${post.pt_name}</div>`
        html+= `<div class="blood-group">${post.bg}</div>`
        html+= `<div class="blood-required">${post.quantity} bag(s)</div>`
        html+= `<div class="blood-required" style="text-align: center;">Date: ${post.approx_date}</div>`
        html+= `<div class="timeline">Posted By: ${post.posted_by_name}</div>`
        html+= `</div>`
        html+= `</a>`
        html+= `</div>` 
        html+= `<div class="info">`
        html+= `<div class="place">Contact: ${post.contact}</div>`
        html+= `<div class="place">Place: ${post.place}</div>`
        html+= `<div class="add-requirements">Additional Requirements: ${post.requirement}</div>`
        html+= `<div class="complications">Complications: ${post.complication}</div>`
        html+= `</div>`
        html+= `<div class="btn">`
        html+= `<a href="/request/view/${post.request_id}" target="blank"><span class="view-profile-btn">View Details</span></a>`
        if(post.responder != 'self') html+= `<a href="/request/respond?to=${post.request_id}&from=${post.responder_id}"><span class="respond-btn">Respond</span></a>`
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
