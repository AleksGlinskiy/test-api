document.addEventListener("DOMContentLoaded", function(){
    const api_url = "https://my-json-server.typicode.com/AleksGlinskiy/serv-demo/posts";
    const list = document.getElementById("list");
    const title = document.getElementById("title");
    const modal = document.getElementById("photo_modal");
    let page = 0;

    async function getTitle(item, container) {
        container.innerHTML = "Загрузка...";
        container.classList.add("load");
        const response = await fetch(api_url);
        if (response.ok) { 
            let data = await response.json();
            container.classList.remove("load");

            if (item < 0) item = page = data.length-1;
            if (item > data.length-1) item = page = 0;
            container.innerHTML = data[item].title;
            
        } else { 
            alert("Ошибка HTTP: " + response.status); 
        }
    }

    async function getCollections(item, container) {
        container.classList.add("load");
        const response = await fetch(api_url);
        if (response.ok) { 
            let data = await response.json();
            container.innerHTML ="";
            container.classList.remove("load");

            if (item < 0) item = page = data.length-1;
            if (item > data.length-1) item = page = 0;
            data[item].collections.forEach(idx => container.innerHTML += componentCard(idx));
        } else { 
            alert("Ошибка HTTP: " + response.status); 
        }
    }

    function componentCard(data) {
        let divCard = document.createElement("div");
        divCard.className = "card";
        divCard.innerHTML = `<a href="${data.full}" class="card__link"><img src="${data.thumb}" alt="${data.id}" class="card__img"></a>`;
        return divCard.outerHTML;
    }

    function updatePage(item) {
        getTitle(item, title);
        getCollections(item, list);
    }

    document.getElementById("page-next").onclick = function(event) {
        event.preventDefault();
        page += 1;
        updatePage(page);
    }

    document.getElementById("page-prev").onclick = function(event) {
        event.preventDefault();
        page -= 1;
        updatePage(page);
    }

    list.onclick = function(event) {
        event.preventDefault();
        let target = event.target;
        if (target.className != 'card__img') return; 
        openModal(target.parentNode.getAttribute("href"));
    }
    
    function openModal(image) {
        modal.querySelector(".modal__content").innerHTML = `<img src="${image}1" class="img-full" alt="modal">`;
        modal.classList.add("open");
    }

    modal.onclick = function(event) {
        event.preventDefault();
        let target = event.target;
        if (target.className === 'img-full') return; 
        this.classList.remove("open");
    }

    updatePage(page);
});