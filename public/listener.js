


window.addEventListener('DOMContentLoaded', (event) => {
    let clickCount = 0;
    let answerDiv = document.querySelectorAll('.user-answer');
    answerDiv.forEach(answer => {
        answer.addEventListener('click', (event) => {
            clickCount += 1;
            answer.setAttribute("id", clickCount % 2 === 0 ? "" : "expandDiv")


        })
    })
    let newAnswerButton = document.querySelectorAll('.add-answer');
    newAnswerButton.forEach((but) => {
        but.addEventListener('click', e => {
            e.preventDefault();

            window.location = `/answers/${e.target.id}`
            console.log(window);
        })
    })

})
