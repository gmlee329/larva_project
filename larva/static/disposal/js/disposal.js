var div_page1 = document.getElementById('div_page1');
var div_page2 = document.getElementById('div_page2');
var div_page3 = document.getElementById('div_page3');
var div_page4 = document.getElementById('div_page4');

var div_progress = document.getElementById('div_progress');
var div_predict = document.getElementById('div_predict');
var div_item = document.getElementById('div_item');
var div_item_content = document.getElementById('div_item_content');
var div_item_content_percent = document.getElementById('div_item_content_percent');
var div_item_other_content = document.getElementById('div_item_other_content');
var div_standard = document.getElementById('div_standard');
var div_standard_content = document.getElementById('div_standard_content');
var div_count = document.getElementById('div_count');
var div_count_content = document.getElementById('div_count_content');
var div_price = document.getElementById('div_price');
var div_price_content = document.getElementById('div_price_content');
var div_add = document.getElementById('div_add');
var div_choice_content = document.getElementById('div_choice_content');
var selector = document.getElementById('selector');
var image = document.getElementById('image');
var div_cards = document.getElementById('div_cards');
var div_count_number = document.getElementById('div_count_number');
var choices = [];

document.getElementById('disposal_date').value = new Date().toISOString().substring(0, 10);
document.getElementById('disposal_date').min = new Date().toISOString().substring(0, 10);
makeItemOptions();

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
    div_add.style.display = 'none';
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
    div_add.style.display = 'none';
}

function setItemAndStandard(result) {
    div_item.style.display = 'flex';
    div_standard.style.display = 'flex';
    div_item_content.innerHTML = result['item'][0][0];
    div_item_content_percent.innerHTML = '&nbsp;Ι&nbsp;' + result['item'][0][1] + '%';
    makeOptions(result['standards'], div_standard_content, getPrice);
    div_item_other_content.innerHTML = result['item'][0][0];
    choices = Array.from(result['item'].slice(1), item => item[0]);
}

function makeOptions(option_list, parent, onSelect) {
    for (var option of option_list) {
        var child = document.createElement('div');
        child.innerHTML = option;
        child.classList.add('standard_select');
        child.onclick = function(e) {
            selectFunction(parent, this, onSelect);
        };
        parent.appendChild(child);
    }
}

function onClickStandard(parent, standard) {
    Array.from(parent.children).forEach(
        v => {
            if(v.innerHTML == standard) {
                v.click();
            }
        }
    );
}

function selectFunction(parent, child, onSelect){
    Array.from(parent.children).forEach(
        v => {
            v.classList.remove('standard_selected');
            v.classList.add('standard_select');
        }
    );
    if(child) {
        child.classList.remove('standard_select');
        child.classList.add('standard_selected');
    }
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
            div_add.style.display = 'flex';
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
            div_add.style.display = 'none';
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
            if(result['selected_standard'] != '') {
                onClickStandard(div_standard_content, result['selected_standard']);
            }
        })
        .catch(e => {
            Initialization();
            alert(e);
            return
        })
}

function makeItemOptions() {
    var items = ['품목', '가스레인지', '냉장고', '밥상', '서랍장', '선풍기', '세탁기', '소파', '안마의자', '에어프라이어', '의자', '장롱', '전기밥솥', '전자레인지', '책상', '침대', '텔레비전', '화장대'];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var option = document.createElement("option");
        option.textContent = item;
        option.value = item;
        selector.appendChild(option);
    }
    selector.onchange = function() {
        var selected_option = document.getElementById('selected_option');
        if (selector.selectedIndex != 0) {
            selected_option.innerHTML = selector.options[selector.selectedIndex].value;
            getStandard(selected_option);
        }
    }
}

function addToCart() {
    var total_count = parseInt(div_count_number.innerHTML);
    div_count_number.innerHTML = total_count + 1;

    var div_card = document.createElement('div');
    // div_card.style.cssText = 'display: flex\; justify-content: flex-start\; flex-direction: row\;';
    div_card.classList.add('div_info');

    var card_img = document.createElement('div');
    // card_img.style.cssText = 'display: flex\; align-items: center\; margin-right: 10px\;';
    card_img.classList.add('div_card_img')
    var card_img_content = document.createElement('img');
    card_img_content.src = document.getElementById("img").src;
    // card_img_content.style.cssText = 'width: 100px\;';
    card_img_content.classList.add('card_img');
    card_img.appendChild(card_img_content);

    var card_contents = document.createElement('div');
    // card_contents.style.cssText = 'display: flex\; justify-content: flex-start\; flex-direction: column\;';
    card_contents.classList.add('div_info_content');

    var card_item = document.createElement('div');
    // card_item.style.cssText = 'display: flex\; justify-content: flex-start\; flex-direction: row\;';
    card_item.classList.add('content_box');
    var card_item_title = document.createElement('div');
    card_item_title.innerHTML = '[&nbsp\;품목&nbsp\;]';
    // card_item_title.style.cssText = 'width: 60px\; text-align: right\; margin-right: 10px\;';
    card_item_title.classList.add('content_title');
    var card_item_content = document.createElement('div');
    card_item_content.innerHTML = div_item_content.innerHTML;
    // card_item_content.style.cssText = 'width: 100px\;';
    card_item_content.classList.add('content_text');
    card_item.appendChild(card_item_title);
    card_item.appendChild(card_item_content);

    var card_standard = document.createElement('div');
    // card_standard.style.cssText = 'display: flex\; justify-content: flex-start\; flex-direction: row\;';
    card_standard.classList.add('content_box');
    var card_standard_title = document.createElement('div');
    card_standard_title.innerHTML = '[&nbsp\;규격&nbsp\;]';
    // card_standard_title.style.cssText = 'width: 60px\; text-align: right\; margin-right: 10px\;';
    card_standard_title.classList.add('content_title');
    var card_standard_content = document.createElement('div');
    var matches = div_standard_content.getElementsByClassName('standard_selected');
    for (var i=0; i<matches.length; i++) {
        card_standard_content.innerHTML = matches[i].innerHTML;
    }
    // card_standard_content.style.cssText = 'width: 100px\;';
    card_standard_content.classList.add('content_text');
    card_standard.appendChild(card_standard_title);
    card_standard.appendChild(card_standard_content);

    var card_count = document.createElement('div');
    // card_count.style.cssText = 'display: flex\; justify-content: flex-start\; flex-direction: row\;';
    card_count.classList.add('content_box');
    var card_count_title = document.createElement('div');
    card_count_title.innerHTML = '[&nbsp\;수량&nbsp\;]';
    // card_count_title.style.cssText = 'width: 60px\; text-align: right\; margin-right: 10px\;';
    card_count_title.classList.add('content_title');
    var card_count_content = document.createElement('div');
    card_count_content.innerHTML = div_count_content.value;
    // card_count_content.style.cssText = 'width: 100px\;';
    card_count_content.classList.add('content_text');
    card_count.appendChild(card_count_title);
    card_count.appendChild(card_count_content);

    var card_total_price = document.createElement('div');
    // card_total_price.style.cssText = 'display: flex\; justify-content: flex-start\; flex-direction: row\;';
    card_total_price.classList.add('content_box');
    var card_total_price_title = document.createElement('div');
    card_total_price_title.innerHTML = '[총금액]';
    // card_total_price_title.style.cssText = 'width: 60px\; text-align: right\; margin-right: 10px\;';
    card_total_price_title.classList.add('content_title');
    var card_total_price_content = document.createElement('div');
    card_total_price_content.innerHTML = parseInt(div_price_content.innerHTML) * parseInt(div_count_content.value);
    // card_total_price_content.style.cssText = 'width: 100px\;';
    card_total_price_content.classList.add('content_text');
    card_total_price.appendChild(card_total_price_title);
    card_total_price.appendChild(card_total_price_content);

    var card_delete = document.createElement('div');
    // card_delete.style.cssText = 'display: flex\; justify-content: flex-start\; flex-direction: row\; align-items: center\;';
    card_delete.classList.add('card_delete');
    var card_delete_button = document.createElement('div');
    card_delete_button.innerHTML = '＿';
    // card_delete_button.style.cssText = 'display:table-cell\; vertical-align:middle\; clear:both\; text-align:center\; width: 30px\; height: 30px\; border: 1px solid white\; border-radius: 3px\; background-color: #ebebeb\; cursor: pointer\;';
    card_delete_button.classList.add('card_delete_button');
    card_delete_button.onclick = function() {
        var total_count = parseInt(div_count_number.innerHTML);
        div_count_number.innerHTML = total_count - 1;
        this.parentNode.parentNode.remove();
    };
    card_delete.appendChild(card_delete_button);

    card_contents.appendChild(card_item);
    card_contents.appendChild(card_standard);
    card_contents.appendChild(card_count);
    card_contents.appendChild(card_total_price);

    div_card.appendChild(card_img);
    div_card.appendChild(card_contents);
    div_card.appendChild(card_delete);

    div_cards.appendChild(div_card);

    div_progress.style.display = 'none';
    div_predict.style.display = 'none';
    div_item.style.display = 'none';
    div_standard.style.display = 'none';
    div_price.style.display = 'none';
    div_count.style.display = 'none';
    div_add.style.display = 'none';

    var img = document.getElementById("img");
    img.src = "/static/disposal/img/logo_camera.png";
    div_count_content.value = '1';
}

function goToPage1() {
    div_page1.style.display = 'flex';
    div_page2.style.display = 'none';
    div_page3.style.display = 'none';
    div_page4.style.display = 'none';
}

function goToPage2() {
    div_page1.style.display = 'none';
    div_page2.style.display = 'flex';
    div_page3.style.display = 'none';
    div_page4.style.display = 'none';
    div_item_content_percent.innerHTML = '';
    removeOptions(div_choice_content);
    makeOptions(choices, div_choice_content, getStandard);
}

function goToPage3() {
    div_page1.style.display = 'none';
    div_page2.style.display = 'none';
    div_page3.style.display = 'flex';
    div_page4.style.display = 'none';
}

function goToPage4() {
    div_page1.style.display = 'none';
    div_page2.style.display = 'none';
    div_page3.style.display = 'none';
    div_page4.style.display = 'flex';
}

async function goToPage5() {
    try {
        var items = {};
        var name = String(document.getElementById('name').value);
        var phone = String(document.getElementById('phone').value);
        var address = String(document.getElementById('address').value);
        var disposal_date = String(document.getElementById('disposal_date').value);
        name.replace(/\s/gi, "");
        address = address.trim();

        var phone_pattern = /[0-9]{3}-[0-9]{4}-[0-9]{4}/;
        var phone_number = phone;
        if (!phone_number.match(phone_pattern)) {
            alert("전화번호를 형식에 맞게 입력해주세요.");
            return
        }

        if (name == '' || phone == '' || address == '' || disposal_date == '') {
            alert("예약자 정보를 입력해주세요.");
            return
        }

        items['name'] = name;
        items['phone'] = phone;
        items['address'] = address;
        items['disposal_date'] = disposal_date;
        items['contents'] = [];
        if (div_cards.children.length == 0) {
            alert("등록된 품목이 없습니다.");
            return
        }
        Array.from(div_cards.children).forEach(
            card => {
                var content = {};
                var card_img = card.firstChild.firstChild.src;
                var card_content = card.firstChild.nextSibling;
                var card_item = card_content.firstChild;
                var card_item_content = card_item.lastChild.innerHTML;
                var card_standard = card_item.nextSibling;
                var card_standard_content = card_standard.lastChild.innerHTML;
                var card_count = card_standard.nextSibling;
                var card_count_content = card_count.lastChild.innerHTML;
                var card_total_price = card_count.nextSibling;
                var card_total_price_content = card_total_price.lastChild.innerHTML;
                
                content['img'] = card_img;
                content['item_name'] = card_item_content;
                content['charge_standard'] = card_standard_content;
                content['reservation_count'] = card_count_content;
                content['total_price'] = card_total_price_content;

                items['contents'].push(content);
            }
        );
    } catch (e) {
        alert("요청을 처리할 수 없습니다.");
        return
    }

    div_page4.style.display = 'none';
    document.getElementById('page_wait').style.display = 'flex';
    // const csrftoken = getCookie('csrftoken');
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    payload = JSON.stringify(items);
    await fetch(
        '/disposal/registration/',
        {
            method: 'POST',
            body: payload,
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'same-origin',
            headers: { "X-CSRFToken": csrftoken },
        })
        .then(async response => {
            return response.text();
        })
        .then((html) => {
            document.getElementById('page_wait').style.display = 'none';
            div_page4.style.display = 'none';
            div_page1.style.display = 'none';
            div_page2.style.display = 'none';
            div_page3.style.display = 'none';
            document.body.innerHTML = html;
        })
        .catch(e => {
            document.getElementById('page_wait').style.display = 'none';
            div_page4.style.display = 'flex';
            alert(e);
            return
        })
}

var autoHypenPhone = function(str){
    str = str.replace(/[^0-9]/g, '');
    var tmp = '';
    if( str.length < 4){
        return str;
    }else if(str.length < 7){
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        return tmp;
    }else if(str.length < 11){
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 3);
        tmp += '-';
        tmp += str.substr(6);
        return tmp;
    }else{              
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);
        return tmp;
    }
}

document.getElementById('phone').onkeyup = function() {
    this.value = autoHypenPhone(this.value);
}