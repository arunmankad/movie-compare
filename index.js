console.log('Hi there!');
// let globalMovieList = [];

// const fetchData = async (search)=>{
//     const repsonse = await axios.get('http://www.omdbapi.com/',{
//         params:{apikey: '6346ae0e',
//         s: search
//     }});
//     if(repsonse.data.Error){
//         return [];
//     }
//     return (repsonse.data.Search);
// }

// fetchData();

const autoCompleteConfig = {
    renderOptions(movie){
        const imgSrc = movie.Poster === 'N/A'?"":movie.Poster;
        return  `
                    <img src="${imgSrc}">
                    ${movie.Title} - ${movie.Year}
                `;
    },
    inputValue(movie){
        return movie.Title;
    },
    async fetchData(search){
        const repsonse = await axios.get('http://www.omdbapi.com/',{
            params:{apikey: '6346ae0e',
            s: search
        }});
        if(repsonse.data.Error){
            return [];
        }
        return (repsonse.data.Search);
    }
};

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
    }
});
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
    }
});
// createAutoComplete({
//     root: document.querySelector('.autocomplete-two')
// })
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side)=>{
    const repsonse = await axios.get('http://www.omdbapi.com/',{
        params:{apikey: '6346ae0e',
        i: movie.imdbID
    }});
    console.log(repsonse.data);
    // document.querySelector('#summary').innerHTML = movieTemplate(repsonse.data);
    summaryElement.innerHTML = movieTemplate(repsonse.data);
    
    if(side==='left'){
        leftMovie = repsonse.data;
       
    }else {
        rightMovie = repsonse.data;
       
    }
    if(leftMovie &&  rightMovie){
        runComparison();
    }
}
const runComparison = ()=>{
    console.log('time for comparison');
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification')
    
    leftSideStats.forEach((leftStat, index)=>{
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);
        if(rightSideValue > leftSideValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })
}
const movieTemplate = (movieDetails)=>{
    
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))
    const metaScore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));

    let count = 0;

    const awards = movieDetails.Awards.split(' ').reduce((prev ,element) => {
        
        const value = parseInt(element);
        if(isNaN(value)){
            return prev;
        } else {
            return prev + value;
        }
    }, 0);
    console.log('count - '+ awards);
    const imgSrc = movieDetails.Poster === 'N/A'?"":movieDetails.Poster;
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${imgSrc}" alt="">
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
    <article data-value="${awards}" class="notification is-primary">
        <p class="title">${movieDetails.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollars}" class="notification is-primary">
        <p class="title">${movieDetails.BoxOffice}</p>
        <p class="subtitle">BoxOffice</p>
    </article>
     <article data-value="${metaScore}" class="notification is-primary">
        <p class="title">${movieDetails.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article> 
    <article data-value="${imdbRating}" class="notification is-primary">
        <p class="title">${movieDetails.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    </article> 
    <article data-value="${imdbVotes}" class="notification is-primary">
        <p class="title">${movieDetails.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
}