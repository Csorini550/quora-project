window.addEventListener("load", (event)=>{
    const searchBar = document.querySelector('#search-bar');

    searchBar.addEventListener('submit', async(event) => {
        event.preventDefault();
        const term = document.querySelector('#search-term').value;
        const body = { term };
        try {
            const res = await fetch('/api/search', { method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(body)
         });
        } catch(err) {

        }
    })
})