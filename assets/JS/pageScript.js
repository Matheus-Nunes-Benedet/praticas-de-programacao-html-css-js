const rail = document.getElementById('rail');
const body = document.body;

rail.addEventListener('click', ()=>{
    body.classList.toggle('dark');
    body.classList.toggle('light');
    body.classList.remove('easterEgg');
})