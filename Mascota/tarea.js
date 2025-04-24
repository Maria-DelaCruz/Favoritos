document.addEventListener("DOMContentLoaded", () => {
    const apis = {
        dog: ["Perro.jpeg", "Perro2.jpeg"],
        cat: ["Gato.jpeg", "Gato3.jpeg"],
    };

    // AÑADIR IMAGEN EN GALERIA DE FAVORITOS
    function addImageToFavorites(src) {
        // Evitar agregar duplicados
        const gallery = document.querySelector("#main-images");
        if ([...gallery.children].some(img => img.querySelector("img").src === src)) {
            showNotification("Esta imagen ya está en favoritos");
            return;
        }

        // Crear contenedor para la imagen y el botón
        const imageContainer = document.createElement("div");
        imageContainer.className = "image-container";

        // Crear la imagen
        const image = document.createElement("img");
        image.src = src;
        image.className = "gallery-image";
        imageContainer.appendChild(image);

        // Crear el botón de eliminar
        const removeButton = document.createElement("button");
        removeButton.innerText = "X";
        removeButton.className = "remove-fav-button";
        removeButton.onclick = () => {
            imageContainer.remove();
            removeFavorite(src);
        };
        imageContainer.appendChild(removeButton);

        // Agregar el contenedor a la galería
        gallery.appendChild(imageContainer);
    }

    // SELECCION DE IMAGEN EN API
    function setImage(api) {
        const headers = new Headers({
            "Content-Type": "application/json",
            "x-api-key": "le3d85c22-149d-40df-a372-9f601ba54b55",
        });

        fetch(
            `https://api.the${api}api.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1`,
            { method: "GET", headers, redirect: "follow" }
        )
        .then(response => response.json())
        .then(data => {
            const imageUrl = data[0].url;
            document.querySelector("#main-img").src = imageUrl;
        })
        .catch(error => console.error("Error:", error));
    }

    // GUARDAR IMAGEN EN FAVORITOS
    document.querySelector("#fav-button").onclick = () => {
        const favImgUrl = document.querySelector("#main-img").src;
        localStorage.setItem("fav-img", favImgUrl);
        document.querySelector("#fav-img").src = favImgUrl;
        addImageToFavorites(favImgUrl);
        showNotification("Imagen Guardada");
    };

    // ELIMINAR IMAGEN FAVORITA
    function removeFavorite(src) {
        if (localStorage.getItem("fav-img") === src) {
            localStorage.removeItem("fav-img");
        }
        showNotification("Imagen Eliminada");
    }

    // CAMBIAR IMAGEN
    document.querySelectorAll(".api-button").forEach(button => {
        button.onclick = () => setImage(button.dataset.api);
    });

    // NOTIFICACION DE GUARDADO EN FAVORITOS
    function showNotification(message) {
        const notification = document.querySelector("#notification");
        notification.innerText = message;
        notification.style.opacity = 1;
        setTimeout(() => {
            notification.style.opacity = 0;
        }, 2000);
    }
});
