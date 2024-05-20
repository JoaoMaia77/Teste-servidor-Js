function enviarDados() {
    const form = document.getElementById('voluntariadoForm');
    const formData = new FormData(form);

    fetch('http://localhost:3000/projeto-voluntariado', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Dados enviados com sucesso!');
            form.reset();
        } else {
            alert('Erro ao enviar dados. Por favor, tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao enviar dados. Por favor, tente novamente.');
    });
}
