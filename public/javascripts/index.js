
window.addEventListener("DOMContentLoaded", (event)=>{
    const searchBar = document.querySelector('#search-bar');
    const searchContainer = document.querySelector('#search-container')
    
    // searchBar.addEventListener('submit', async(event) => {
    //     const term = document.querySelector('.search-input').value;
    //     const body = { term };
    //     try {
    //         const res = await fetch('/api/search', { 
    //             method: 'POST', 
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             }, 
    //             body: JSON.stringify(body)
    //         });
    //         const foundQuestions = await res.json();
    //         console.log(foundQuestions);

    //         let { searchQuestions } = foundQuestions;

    //         let inputText = document.createElement('p');
            
    //         if (foundQuestions.length === 0) {
    //             // inputBox = `<p> No results found! </p>`

    //             inputText.innerHTML = 'No Results Found!'
    //             searchContainer.appendChild(inputText);

    //             //document.innerHTML = `<p> No results found! </p>`
    //         } else {

    //             //inputText.innerHTML = foundQuestions;
                
    //             for (let question in foundQuestions) {
    //                 let list = document.createElement('ul');
    //                 let listItem = document.createElement('li');
    //                 let questionObj = foundQuestions[question];
    //                 let questionValue = questionObj.value;
    //                 let valueNode = document.createTextNode(`${questionValue} \n`)
    //                 listItem.appendChild(valueNode);
    //                 list.appendChild(listItem);
    //                 searchContainer.appendChild(list);
    //             }

    //             // for (let question in foundQuestions) {
    //             //     let questionDiv = document.createElement('div');
    //             //     let username = document.createElement('span');
    //             //     let header2 = document.createElement('h2');
    //             //     let answerDiv = document.createElement('div');
    //             //     // set innerHTML to username for the question.
    //             //     username.setAttribute('id', 'user2');
    //             //     username.innerHTML = `${user.email}`;
    //             //     questionDiv.classList.add(`${question.id}`);
    //             //     let questionTitle = question.appendChild(header2);
    //             //     questionTitle.innerHTML = question.value;
    //             //     answerDiv.classList.add(answer);
    //             //     answerDiv.append()
    //             // };

    //             // searchContainer.appendChild()

    //         //     let questionsHTML = "ul";
    //         //     for (let question of foundQuestions) {
    //         //         questionsHTML += `<a href="/questions/${question.id}/">
    //         //             <div class="questionBox"> 
    //         //                 <li class="questionBox__content"> ${question.value} </li>
    //         //             </div>
    //         //         </a>`;
    //         //     }
    //         // questionsHTML += `</ul>`;
    //         // document.innerHTML = questionsHTML;

    //         }

    //     } catch(err) {
    //         console.error(err);
    //     }
    // })
})