let currentValue = 0;

function Counter(obj, oldValue, newValue) {
    let oldStr = oldValue.toString();
    let newStr = newValue.toString();

    oldStr = oldStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    newStr = newStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    while (oldStr.length < newStr.length) {
        oldStr = '0' + oldStr;
    }
    while (newStr.length < oldStr.length) {
        newStr = '0' + newStr;
    }

    obj.empty();

    let setOfNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let numArray = newStr.split("").map(function (char) {
        return parseInt(char, 10);
    });

    for (let i = 0; i < newStr.length; i++) {
        if ($.inArray(newStr[i], ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) !== -1) {
            obj.append('<span class="digit-con"><span class="digit' + i + '">0<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br></span></span>');
            let digit = parseInt(newStr[i], 10);
            let oldDigit = parseInt(oldStr[i], 10);
            obj.find('.digit' + i).css('top', -(10.5 * oldDigit) + 'rem');
        } else {
            obj.append('<span class="comma">' + newStr[i] + '</span>');
        }
    }

    let increment = obj.find('.digit-con').outerHeight();
    let speed = 2000;

    for (let i = 0; i < numArray.length; i++) {
        obj.find('.digit' + i).animate({ top: -(increment * numArray[i]) }, Math.round(speed / (1 + (i * 0.333))));
    }
}

$(document).ready(function () {
    // 클라이언트 IP 주소 가져오기
    $.getJSON('https://api64.ipify.org?format=json', function(data) {
        const clientIp = data.ip;

        // 서버에 방문 정보 전송
        $.ajax({
            type: "POST",
            url: "http://43.203.124.149//api/visitors",
            headers: {
                "X-Forwarded-For": clientIp // 실제 클라이언트 IP 주소를 전달
            }
        });

        // 초기 조회수 가져오기
        updateVisitCount();

        // 3초마다 조회수 업데이트
        setInterval(updateVisitCount, 3000);
    });
});

function updateVisitCount() {
    $.get("http://43.203.124.149/api/visitors/count", function (response) {
        if (response && response.data) {
            let oldValue = currentValue;
            currentValue = response.data.visitorCount;

            $('.number').each(function () {
                Counter($(this), oldValue, currentValue);
            });
        }
    });
}
