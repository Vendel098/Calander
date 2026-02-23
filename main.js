document.querySelectorAll('.input-box i').forEach(icon => {
  const input = icon.parentElement.querySelector('input[type="password"]');
  
  if (input) {
    icon.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-sharp fa-solid fa-eye-slash');
        icon.classList.add('fa-sharp fa-solid fa-eye');
      } 
      else {
        input.type = 'password';
        icon.classList.remove('fa-sharp fa-solid fa-eye');
        icon.classList.add('fa-sharp fa-solid fa-eye-slash');
      }
    });
    
    icon.style.cursor = 'pointer';
  }
});