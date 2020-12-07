// const surpriseDiv = document.querySelector('#surprise-div');
// surpriseDiv.addEventListener('click', event => {
//   const body = document.body;
//   const blueGradient = 'linear-gradient(to bottom right, #466a8d, #352268)';
//   const orangeGradient = 'linear-gradient(to bottom right, #fc9969, #ee258a)';
//   let count = 0;

//   let fade = setInterval(() => {
//     if (count % 2 === 0) {
//       body.style.transition = 'all 1s ease-out';
//       body.style.backgroundImage = blueGradient;
//       count++;
//     } else {
//       body.style.transition = 'all 1s ease-out';
//       body.style.backgroundImage = orangeGradient;
//       count++
//     }
//   }, 500);
// });

const surpriseDiv = document.querySelector('#surprise-div');
surpriseDiv.addEventListener('click', event => {
  document.body.style.backgroundImage = '';
  let colors = ["red", "orange", "yellow", "green", "blue", "purple"];
  let currentIndex = 0;

  setInterval(function() {
    document.body.style.cssText = "background-color: " + colors[currentIndex];
    currentIndex++;
    if (currentIndex == undefined || currentIndex >= colors.length) {
      currentIndex = 0;
    }
  }, 1000);

});
