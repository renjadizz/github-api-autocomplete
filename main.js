window.onload = (event) => {

    const input = document.getElementById("searchField");

    async function updateValue(e) {
        const searchedValue = e.target.value;
        const githubResult = await fetch(`https://api.github.com/search/repositories?q=${searchedValue}&per_page=5`);
        const jsonData = await githubResult.json();
        console.log(jsonData);
        //log.textContent = e.target.jsonData;
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

