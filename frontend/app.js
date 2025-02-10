const BASE_URL = "http://localhost:3000/usuarios/register"; // Cambia el puerto si es necesario

document.getElementById("form-register").addEventListener("submit", async (event) => {
  event.preventDefault(); // Evitar que la página se recargue

  // Capturar los datos del formulario
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const contraseña = document.getElementById("contraseña").value;

  try {
    // Enviar los datos al backend con fetch
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, correo, contraseña }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("¡Registro exitoso!");
    } else {
      alert(`Error: ${data.mensaje}`);
    }
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    alert("Hubo un problema al enviar la solicitud.");
  }
});


  
  