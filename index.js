console.log('Hi there!');
let globalMovieList = [];

const fetchData = async (search)=>{
    const repsonse = await axios.get('http://www.omdbapi.com/',{
        params:{apikey: '6346ae0e',
        s: search
    }});
    if(repsonse.data.Error){
        return [];
    }
    return (repsonse.data.Search);
}

// fetchData();

const root = document.querySelector('.autocomplete');
root.innerHTML =`
<label><b>Search For a Movie</b></label>
<input class="input" />
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results">
        </div>
    </div>
</div>
`;
const input = document.querySelector('input');

const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');


const onInput = async (event)=>{
   
    const movies =  await fetchData(event.target.value);
    globalMovieList = movies;
    if(!movies.length){
        dropdown.classList.remove('is-active');
        return;
    }
    console.log(movies);
    resultsWrapper.innerHTML = "";
    dropdown.classList.add('is-active');
    for(let movie of movies){
        const option = document.createElement('a');
        const imgSrc = movie.Poster === 'N/A'?"":movie.Poster;
        option.classList.add('dropdown-item');
        option.innerHTML = `
            <img src="${imgSrc}">
            ${movie.Title}
        `;
        option.addEventListener('click',event=>{
            input.value = movie.Title;
            dropdown.classList.remove('is-active');
            globalMovieList = [];
            onMovieSelect(movie);
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

const onMovieSelect = async (movie)=>{
    const repsonse = await axios.get('http://www.omdbapi.com/',{
        params:{apikey: '6346ae0e',
        i: movie.imdbID
    }});
    console.log(repsonse.data);
    document.querySelector('#summary').innerHTML = movieTemplate(repsonse.data);
}

const movieTemplate = (movieDetails)=>{
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetails.Poster}" alt="">
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetails.Title}</h1>
                <h4>${movieDetails.Genre}</h4>
                <p>${movieDetails.Plot}</p>
            </div>
        </div>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetails.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetails.BoxOffice}</p>
        <p class="subtitle">Awards</p>
    </article> <article class="notification is-primary">
        <p class="title">${movieDetails.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article> <article class="notification is-primary">
        <p class="title">${movieDetails.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    </article> <article class="notification is-primary">
        <p class="title">${movieDetails.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
}