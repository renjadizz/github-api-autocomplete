window.onload = (event) => {

    const input = document.getElementsByClassName("search__input")[0];
    const searchList = document.getElementsByClassName("search__list")[0];

    async function updateValue(e) {
        clearSearchList(searchList);
        if (e.target.value.trim().length) {
            const searchedValue = e.target.value;
            const githubResult = await fetch(`https://api.github.com/search/repositories?q=${searchedValue}&per_page=5`);
            const jsonData = await githubResult.json();
            populateSearchList(jsonData.items, searchList);
        }
    }

    function populateSearchList(data, searchList) {
        let ulNode = document.createElement("ul");
        ulNode.setAttribute("class", "search__list__ul");
        for (let item of data) {
            let liNode = document.createElement("li");
            liNode.setAttribute("class", "search__list__ul__li");
            liNode.setAttribute("id", item.id);
            liNode.setAttribute("name", item.name);
            liNode.setAttribute("owner", item.owner.login);
            liNode.setAttribute("stars", item.stargazers_count);
            let aNode = document.createElement("a");
            aNode.setAttribute("class", "search__list__ul__li__a");
            aNode.setAttribute("href", "#");
            aNode.textContent = item.name;
            liNode.append(aNode);
            ulNode.append(liNode);
        }
        searchList.append(ulNode);
    }

    function clearSearchList(searchList) {
        while (searchList.firstChild) {
            searchList.removeChild(searchList.firstChild);
        }
    }

    function debounce(fn, timeout = 1000) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, timeout);
        }
    }

    const processChange = debounce((res) => updateValue(res));
    input.addEventListener("input", processChange);
}

