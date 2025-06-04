document.addEventListener('DOMContentLoaded', () => {
    const goals = document.querySelectorAll('.goals ul li');
    let currentIndex = 0;

    function resetHover() {
        goals.forEach(goal => {
            goal.classList.remove('hover-animation');
        });
    }

    function animateNextGoal() {
        resetHover();
        goals[currentIndex].classList.add('hover-animation');
        currentIndex = (currentIndex + 1) % goals.length;
    }

    setInterval(animateNextGoal, 2000);
});