const surpriseDiv = document.querySelector('#surprise-div');
surpriseDiv.addEventListener('click', event => {
  const body = document.body;
  const blueGradient = 'linear-gradient(to bottom right, #466a8d, #352268)';
  const orangeGradient = 'linear-gradient(to bottom right, #fc9969, #ee258a)';
  let count = 0;

  setInterval(() => {
    if (count % 2 === 0) {
      body.style.transition = 'all 1s ease-out';
      body.style.backgroundImage = blueGradient;
      count++;
    } else {
      body.style.transition = 'all 1s ease-out';
      body.style.backgroundImage = orangeGradient;
      count++
    }
  }, 500);
});
