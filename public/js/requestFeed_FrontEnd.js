var scrollLock = false;
var bg, div, dist;

function getPosts(offset, bg, div, dist) {
    console.log(offset, bg, div, dist);
    if(!offset || offset == 'undefined') {
        offset = 0;
    }

    if(!bg || bg == 'undefined') {
        bg = '%';
    }
    else bg = encodeURIComponent(bg);

    if(!div || div == 'undefined') {
        div = '%';
    }

    if(!dist || dist == 'undefined') {
        dist = '%';
    }

    fetch('http://localhost:3940/request-feed/list?' + 'offset=' + offset + '&bg=' + bg + '&div=' + div + '&dist=' + dist)
    .then(response => response.json())
    .then(data => loadPostIntoFeed(data));
}

getPosts(null, bg, div, dist);

function loadPostIntoFeed(postsArray) {
    // console.log(postsArray);
    let html = "";
    postsArray.forEach(function (post, index) {
        // console.log(post);
        // html needs to be added
        html+=`<div class="row">`
        html+= `<div class="card-02">`
        html+= `<div class="profile-card">`
        html+= `<a href="/view-profile/${post.post_by_id}" target="blank">`
        html+= `<div class="profile">`
        html+= `<img src="/profile/${post.profile_photo}" alt="" style="height: 25%; width: 25%; border-radius: 50%;">`
        html+= `<div class="pt_div"><div class="name">Patient: </div><span class="pt_name">${post.pt_name}</span></div>`
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
    if(!scrollLock) {
        if(this.innerHeight + this.pageYOffset >= document.body.scrollHeight) {
            let postsLength = document.querySelectorAll('.card-02').length;
            getPosts(postsLength, bg, div, dist);
        }
    }
}

function district() {
    var div_id = $('#basic_division').val();
    if(div_id == 'undefined') return;
    // console.log(div_id);

    $.ajax({
        type: 'GET',
        data: { division_id: div_id },
        url: '/address/districts',
        async: false,
        success: function (data) {
            //console.log(data);
            $('#basic_district').empty();
            $('#basic_district').append('<option disabled selected value="">District</option>');
            $.each(data, function (index, district) {
                $('#basic_district').append("<option value = '" + district.id + "' >" + district.name + " </option>");
            });
        }
    });
}

$(function () {
    $('#basic_division').on("change", district);
});

function removeFilter() {
    window.location.reload();
}

function applyFilter() {
    popupToggle();
    bg = document.getElementById('basic_bg').value;
    div = document.getElementById('basic_division').value;
    dist = document.getElementById('basic_district').value;

    // if(!offset || offset == 'undefined') {
    //     offset = 0;
    // }

    // if(!bg || bg == 'undefined') {
    //     bg = '%';
    // }
    // else bg = encodeURIComponent(bg);

    // if(!div || div == 'undefined') {
    //     div = '%';
    // }

    // if(!dist || dist == 'undefined') {
    //     dist = '%';
    // }

    document.getElementById('left-side').innerHTML = "";
    getPosts(null, bg, div, dist);
    
    // fetch('http://localhost:3940/request-feed/list?' + 'offset=' + offset + '&bg=' + bg + '&div=' + div + '&dist=' + dist)
    // .then(response => response.json())
    // .then(data => {
    //     // console.log(data);
    //     loadPostIntoFeed(data)
    //     scrollLock = true;
    // });
    // console.log(bg, div, dist);
    // window.location.reload();
}
