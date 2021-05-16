var div_form = document.getElementById('div_form');
var page_wait = document.getElementById('page_wait');
var user_name = document.getElementById('name');
var phone = document.getElementById('phone');

function wait() {
    try {
        var phone_pattern = /[0-9]{3}-[0-9]{4}-[0-9]{4}/;
        var phone_number = phone.value;
        if (!phone_number.match(phone_pattern)) {
            alert("전화번호를 형식에 맞게 입력해주세요.");
            return
        }
        var u_name = user_name.value.replace(" ", "");
        if (u_name == '') {
            alert("이름을 공백없이 입력하세요.");
            return
        }
        div_form.style.display = "none";
        page_wait.style.display = "flex";
    }
    catch {
        div_form.style.display = "flex";
        page_wait.style.display = "none";
        alert("Error!");
        return
    }
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

phone.onkeyup = function() {
    this.value = autoHypenPhone(this.value);
}