const createAutoComplete = ({
    root, 
    renderOptions, 
    onOptionSelect, 
    inputValue,
    fetchData
    }) => {
    // const root = document.querySelector('.autocomplete');
    let globalMovieList = [];
    root.innerHTML =`
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
    `;
    const input = root.querySelector('input');
    
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');
    
    
    const onInput = async (event)=>{
       
        const items =  await fetchData(event.target.value);
        globalMovieList = items;
        if(!items.length){
            dropdown.classList.remove('is-active');
            return;
        }
        console.log(items);
        resultsWrapper.innerHTML = "";
        dropdown.classList.add('is-active');
        for(let item of items){
            const option = document.createElement('a');
           
            option.classList.add('dropdown-item');
            option.innerHTML = renderOptions(item)
            option.addEventListener('click',event=>{
                input.value = inputValue(item);
                dropdown.classList.remove('is-active');
                globalMovieList = [];
                onOptionSelect(item);
            });
            // document.querySelector('#target').appendChild(div);
            resultsWrapper.appendChild(option);
        }
    }
    input.addEventListener('input', debounce(onInput, 1000))
    document.addEventListener('click', event => {
        if(!root.contains(event.target)){
            dropdown.classList.remove('is-active');
        }
    });
    input.addEventListener('click', event => {
        if(globalMovieList.length){
            dropdown.classList.add('is-active');
        }
    });
}