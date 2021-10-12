document.addEventListener("DOMContentLoaded", function(){
    const api_url = "https://my-json-server.typicode.com/AleksGlinskiy/serv-demo/posts";

    async function getCollections(wrap, page) {
        const response = await fetch(api_url);
        if (response.ok) { 
            let data = await response.json(); 
            wrap.innerHTML ="";

            if (data.length-1 >= page) {
                data[page].collections.forEach(imgs => {
                    wrap.innerHTML += elementdivCard(imgs);
                });
            } else {
                wrap.innerHTML = "<h3>Данных нет!</h3>";
            }
        }
        else { 
            alert("Ошибка HTTP: " + response.status); 
        }
    }

    async function getTitle(el, page) {
        const response = await fetch(api_url);
        if (response.ok) {
            let data = await response.json();
            
            if (data.length-1 >= page) {
                el.innerHTML = data[page].title;
            } else {
                el.innerHTML = "Страница недоступна";
            }
        }
        else {
            alert("Ошибка HTTP: " + response.status);
        }
    }

    function elementdivCard(data) {
        let divCard = document.createElement("div");
        divCard.className = "card";
        divCard.innerHTML = `<a href="${data.full}" class="card__link"><img src="${data.thumb}" alt="${data.id}" class="card__img"></a>`;
        return divCard.outerHTML;
    }

    function extractGet(name) {
        let result = window.location.search.match(new RegExp(name + '=([^&=]+)'));
        return result ? result[1] : false;
    }

    function addOrUpdateUrlParam(name, value) {
        var href = window.location.href;
        var regex = new RegExp("[&\\?]" + name + "=");
        if (regex.test(href) ) {
            regex = new RegExp("([&\\?])" + name + "=\\d+");
            window.location.href = href.replace(regex, "$1" + name + "=" + value);
        }
        else {
            if(href.indexOf("?") > -1)
            window.location.href = href + "&" + name + "=" + value;
            else
            window.location.href = href + "?" + name + "=" + value;
        }
    }

    function updateDataPage(new_title, new_list, new_page) {
        if (arguments.length == 1) {
            getTitle(title, arguments[0]);
            getCollections(list, arguments[0]);
            addOrUpdateUrlParam("page", arguments[0]);
        } else {
            getTitle(title, new_title);
            getCollections(list, new_list);
    
            if (new_page != undefined) {
                addOrUpdateUrlParam("page", new_page);
            }
        }
    }

    document.getElementById("page-next").onclick = function(e) {
        e.preventDefault();

        page = Number(page) + 1;
        updateDataPage(page);
    }

    document.getElementById("page-prev").onclick = function(e) {
        e.preventDefault();

        if (page <= 0) {
            getTitle(title, 0);
            updateDataPage(0, 0, page);
        } else {
            page = Number(page) - 1;
            updateDataPage(page);
        }
    }

    const list = document.getElementById("list");
    const title = document.getElementById("title");
    let page = extractGet("page");
    if (page >= 0) {
        updateDataPage(page, page);
    } else {
        updateDataPage(0, 0);
    }

    if (page === false) {
        updateDataPage(0);
    }
});