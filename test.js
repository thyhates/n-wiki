/**
 * Created by zhipu.liao on 2016/3/8.
 */
"use strict";
(function (window) {
    var node = document.querySelector("div#test");
    var testBtn = document.querySelector("#testBtn");
    testBtn.addEventListener("click", function (event) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/server/api/etc", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("token","123456");
        var data={
            api:123,
            thy:321
        };
        xhr.send(JSON.stringify(data));
    });

    try {
        if (document.body.webkitMatchesSelector("div#test")) {
            console.log("yes");
        } else {
            console.log(document.body.webkitMatchesSelector("div#test"));
        }
    } catch (err) {
        console.error(err);
    }
    if (node.addEventListener) {
        node.addEventListener("click", function () {
            console.log(node.childNodes);
        });
    } else {
        node.attachEvent("onclick", function (event) {
            console.log(event);
        });
    }
    var table = document.createElement("table");
    table.border = 1;
    table.width = "100%";
    table.style.borderCollapse = "collapse";
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    tbody.insertRow(0);
    tbody.rows[0].insertCell(0);
    tbody.rows[0].cells[0].appendChild(document.createTextNode("first cell"));
    tbody.rows[0].insertCell(1);
    tbody.rows[0].cells[1].appendChild(document.createTextNode("second cell"));
    document.body.appendChild(table);
    console.log(document.compatMode);
})(window);
