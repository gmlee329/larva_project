var div_page1 = document.getElementById('div_page1');
var div_page2 = document.getElementById('div_page2');
var div_progress = document.getElementById('div_progress');
var div_predict = document.getElementById('div_predict');
var div_item = document.getElementById('div_item');
var div_item_content = document.getElementById('div_item_content');
var div_item_other_content = document.getElementById('div_item_other_content');
var div_standard = document.getElementById('div_standard');
var div_standard_content = document.getElementById('div_standard_content');
var div_count = document.getElementById('div_count');
var div_count_content = document.getElementById('div_count_content');
var div_price = document.getElementById('div_price');
var div_price_content = document.getElementById('div_price_content');
var div_next = document.getElementById('div_next');
var div_choice_content = document.getElementById('div_choice_content');
var image = document.getElementById('image');
var choices = [];

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function setPicture(event) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = document.getElementById("img");
        img.src = event.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    enablePredict();
}

function setProgress() {
    div_progress.style.display = 'flex';
    div_predict.style.display = 'none';
    div_item.style.display = 'none';
    div_standard.style.display = 'none';
}

function enablePredict() {
    div_progress.style.display = 'none';
    div_predict.style.display = 'flex';
    div_item.style.display = 'none';
    div_standard.style.display = 'none';
    div_price.style.display = 'none';
    div_count.style.display = 'none';
    div_next.style.display = 'none';
}

function disablePredictProgress() {
    div_progress.style.display = 'none';
    div_predict.style.display = 'none';
}

function Initialization() {
    div_progress.style.display = 'none';
    div_predict.style.display = 'none';
    div_item.style.display = 'none';
    div_standard.style.display = 'none';
    div_price.style.display = 'none';
    div_count.style.display = 'none';
    div_next.style.display = 'none';
}

function setItemAndStandard(result) {
    div_item.style.display = 'flex';
    div_standard.style.display = 'flex';
    div_item_content.innerHTML = result['item'][0];
    makeOptions(result['standards'], div_standard_content, getPrice);
    div_item_other_content.innerHTML = result['item'][0];
    choices = result['item'].slice(1);
}

function makeOptions(option_list, parent, onSelect) {
    for (var option of option_list) {
        var child = document.createElement('div');
        child.innerHTML = option;
        child.onclick = function(e) {
            selectFunction(parent, this, onSelect);
        };
        parent.appendChild(child);
    }
}

function selectFunction(parent, child, onSelect){
    Array.from(parent.children).forEach(
        v => v.classList.remove('standard_selected')
    );
    if(child) child.classList.add('standard_selected');
    onSelect(child);
}

function getPrice(selected_standard) {
    try {
        var item = div_item_content.innerHTML;
        var standard = selected_standard.innerHTML;
        if (item == undefined || item == '' || standard == undefined || standard == '') {
            throw Error();
        }
    } catch (e) {
        Initialization();
        alert("Error, please try again");
        return
    }

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const formData = new FormData();
    formData.append('item', item);
    formData.append('standard', standard);

    fetch(
        '/disposal/price/',
        {
            method: 'POST',
            body: formData,
            mode: 'same-origin',
            headers: { "X-CSRFToken": csrftoken },
        })
        .then(async response => {
            if (response.status == 200) {
                return response
            }
            else if (response.status == 413) {
                throw Error("error")
            }
            else {
                throw Error((await response.clone().json()).message)
            }
        })
        .then(response => response.json())
        .then(result => {
            div_price.style.display = 'flex';
            div_count.style.display = 'flex';
            div_next.style.display = 'flex';
            setPrice(result);
        })
        .catch(e => {
            Initialization();
            alert(e);
            return
        })
}

function setPrice(result) {
    div_price_content.innerHTML = result['price'];
}

function getStandard(selected_item) {
    goToPage1();
    div_item_content.innerHTML = selected_item.innerHTML;
    div_item_other_content.innerHTML = selected_item.innerHTML;
    try {
        var item = div_item_content.innerHTML;
        if (item == undefined || item == '') {
            throw Error();
        }
    } catch (e) {
        Initialization();
        alert("Error, please try again");
        return
    }

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const formData = new FormData();
    formData.append('item', item);

    fetch(
        '/disposal/standard/',
        {
            method: 'POST',
            body: formData,
            mode: 'same-origin',
            headers: { "X-CSRFToken": csrftoken },
        })
        .then(async response => {
            if (response.status == 200) {
                return response
            }
            else if (response.status == 413) {
                throw Error("error")
            }
            else {
                throw Error((await response.clone().json()).message)
            }
        })
        .then(response => response.json())
        .then(result => {
            removeOptions(div_standard_content);
            div_price.style.display = 'none';
            div_count.style.display = 'none';
            div_next.style.display = 'none';
            setStandard(result);
        })
        .catch(e => {
            Initialization();
            alert(e);
            return
        })
}

function setStandard(result) {
    div_standard.style.display = 'flex';
    makeOptions(result['standards'], div_standard_content, getPrice);
}

function removeOptions(parent) {
    while(parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
    }
}

function countMinus() {
    var count = div_count_content.value;
    count = parseInt(count);
    if(count > 1) {
        div_count_content.value = String(count - 1);
    }
}

function countPlus() {
    var count = div_count_content.value;
    count = parseInt(count);
    count = String(count + 1);
    if(count.length <= div_count_content.maxLength) {
        div_count_content.value = count;
    }
}

function predictCategory() {
    try {
        if (image.files[0] == undefined) {
            throw Error("Please upload image file");
        }
        var img = image.files[0];
    } catch (e) {
        disablePredictProgress();
        alert("처리 예약할 폐기물 사진을 올려주세요!");
        return
    }

    setProgress();
    // const csrftoken = getCookie('csrftoken');
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const formData = new FormData();
    formData.append('img', img);

    fetch(
        '/disposal/prediction/',
        {
            method: 'POST',
            body: formData,
            mode: 'same-origin',
            headers: { "X-CSRFToken": csrftoken },
        })
        .then(async response => {
            if (response.status == 200) {
                return response
            }
            else if (response.status == 413) {
                throw Error("Image is too large. Please upload smaller image.")
            }
            else {
                throw Error((await response.clone().json()).message)
            }
        })
        .then(response => response.json())
        .then(result => {
            disablePredictProgress();
            removeOptions(div_standard_content);
            setItemAndStandard(result);
        })
        .catch(e => {
            Initialization();
            alert(e);
            return
        })
}

function goToPage2() {
    div_page1.style.display = 'none';
    div_page2.style.display = 'flex';
    removeOptions(div_choice_content);
    makeOptions(choices, div_choice_content, getStandard);
}

function goToPage1() {
    div_page1.style.display = 'flex';
    div_page2.style.display = 'none';
}