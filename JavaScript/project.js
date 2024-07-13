const projects = document.querySelectorAll('.project');

projects.forEach(project => {
    project.addEventListener('mouseenter', function () {
        this.style.backgroundColor = '#f0f0f0';
    });

    project.addEventListener('mouseleave', function () {
        this.style.backgroundColor = '#fff';
    });
});

function toggle() {
    var sec = document.getElementById('sec');
    var nav = document.getElementById('navigation');
    sec.classList.toggle('active');
    nav.classList.toggle('active');
}
