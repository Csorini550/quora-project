// window.addEventListener("DOMContentLoaded", (event) => {
//   const searchBar = document.querySelector("#search-bar");

//   searchBar.addEventListener("submit", async (event) => {
//     event.preventDefault();
//     const term = document.querySelector(".search-input").value;
//     const body = { term };
//     try {
//       const res = await fetch("/api/search", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       });
//       const foundQuestions = await res.json();

//       let { questions } = foundQuestions;

//       if (questions.length === 0) {
//         main.innerHtml = `<p> No results found! </p>`;
//       } else {
//         let questionsHTML = "ul";
//         for (let question of questions) {
//           questionsHTML += `<a href="/questions/${question.id}/">
//                         <div id="center-column-item">
//                             <div id="user-answer 
//                                  <li id="answer"> ${question.value} </li>
//                             </div>
//                         </div> 
//                     </a>`;
//         }
//         questionsHTML += `</ul>`;
//         main.innerHTML = questionsHTML;
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   });

  const questionCreate = document.querySelector(".question-form");

  questionCreate.addEventListener("submit", async (e) => {
    e.preventDefault();
    const questionField = document.querySelector(".question-field").value;

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: questionField }),
    });
  });
});
