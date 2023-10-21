window.onload = (event) => {

    const input = document.getElementsByClassName("search__input")[0];
    const searchList = document.getElementsByClassName("search__list")[0];

    // eventHandlers
    async function updateValue(e) {
        clearSearchList(searchList);
        if (e.target.value.trim().length) {
            try {
                const searchedValue = e.target.value;
                const githubResult = await fetch(`https://api.github.com/search/repositories?q=${searchedValue}&per_page=5`);
                const jsonData = await githubResult.json();
                populateSearchList(jsonData.items, searchList);
            } catch (error) {
                let pNode = document.createElement("p");
                pNode.setAttribute("class", "search__list__p-error");
                pNode.textContent = "Something went wrong. Please try again later";
                searchList.append(pNode);
            }
        }
    }

    function addToList(e) {
        let tableDivNode = document.getElementsByClassName("repos")[0];
        let tableNode = document.getElementsByClassName("repos__table")[0];
        if (tableNode === undefined) {
            tableNode = document.createElement("table");
            tableNode.setAttribute("class", "repos__table");
            let tableHeaders = ["Name", "Owner", "Stars", " "];
            populateTable(tableNode, tableHeaders, "th");
        }
        if (document.getElementById(e.currentTarget.getAttribute("idForTable")) === null) {
            let liName = e.currentTarget.getAttribute("name");
            let liOwner = e.currentTarget.getAttribute("owner");
            let liStars = e.currentTarget.getAttribute("stars");
            let liId = e.currentTarget.getAttribute("idForTable");
            let tableRowValues = [liName, liOwner, liStars, "X"];
            populateTable(tableNode, tableRowValues, "td", liId);
            tableDivNode.appendChild(tableNode);
        }
        clearSearchList(e.currentTarget.parentNode);
        clearSearchInput(input);
    }

    function deleteFromTable(e) {
        let tableNode = e.target.parentNode.parentNode;
        let trNode = e.target.parentNode;
        trNode.remove();
        if (tableNode.rows.length === 1) {
            tableNode.remove();
        }
    }

    //Helpers
    function populateSearchList(data, searchList) {
        let ulNode = document.createElement("ul");
        ulNode.setAttribute("class", "search__list__ul");
        for (let item of data) {
            let liNode = document.createElement("li");
            liNode.setAttribute("class", "search__list__ul__li");
            liNode.setAttribute("idForTable", item.id);
            liNode.setAttribute("name", item.name);
            liNode.setAttribute("owner", item.owner.login);
            liNode.setAttribute("stars", item.stargazers_count);
            liNode.addEventListener("click", addToList, true);
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

    function clearSearchInput(input) {
        input.value = "";
    }

    function populateTable(tableNode, values, attr, id) {
        let trNode = document.createElement("tr");
        for (let value of values) {
            let thNode = document.createElement(attr);
            if (attr === "td" && id) {
                thNode.setAttribute("id", id);
            }
            thNode.textContent = value;
            if (value === "X") {
                thNode.setAttribute("class", "repos__table__tr-delete");
                thNode.addEventListener("click", deleteFromTable, true);
            }
            trNode.appendChild(thNode);
        }
        tableNode.appendChild(trNode);
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

