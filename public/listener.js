


window.addEventListener('DOMContentLoaded', (event) => {
    let clickCount = 0;
    let answerDiv = document.querySelectorAll('.center-column-item');
    let dropdownDiv = document.querySelector('.dropdown');
    answerDiv.forEach(answer => {
        answer.addEventListener('click', (event) => {
            clickCount += 1;
            answer.setAttribute("id", clickCount % 2 === 0 ? "" : "expandDiv")


        })
    })
    dropdownDiv.addEventListener('click', e => {
        .classList.add(visible)
    })

})
