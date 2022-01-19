export class AddPlaylistForm {
    constructor(container, musicLibrary, musicLibraryView) {
        this.container = container;
        this.musicLibrary = musicLibrary;
        this.musicLibraryView = musicLibraryView;
    }

    render() {
        const addPlaylistForm = document.createElement("form");
        addPlaylistForm.className = "addPlaylistForm";

        const playlistNameLabel = document.createElement("label");
        playlistNameLabel.innerHTML = "Naziv";
        const playlistNameInput = document.createElement("input");
        playlistNameInput.setAttribute("type", "text");
        playlistNameInput.value = "Nova plejlista";
        playlistNameInput.name = "name";

        const playlistDescriptionLabel = document.createElement("label");
        playlistDescriptionLabel.innerHTML = "Opis";

        const playlistDescriptionInput = document.createElement("textarea");
        playlistDescriptionInput.rows = "4";
        playlistDescriptionInput.cols = "50";
        playlistDescriptionInput.setAttribute("type", "text");
        playlistDescriptionInput.value = "Opis plejliste";
        playlistDescriptionInput.name = "description";

        const imageLabel = document.createElement("label");
        imageLabel.innerHTML = "Slika";

        const imageInputDiv = document.createElement("div");
        imageInputDiv.className = "imageInputDiv";
        imageInputDiv.style.backgroundImage = `url('./res/placeholder_image.jpg')`

        const imageInput = document.createElement("input");
        imageInput.setAttribute("type", "file");
        imageInput.className = "imageInput";

        imageInputDiv.appendChild(imageInput);

        const submitBtn = document.createElement("button");
        submitBtn.setAttribute("type", "submit");
        submitBtn.className = "playlistFormBtn";
        submitBtn.innerHTML = "Dodaj plejlistu";

        const endpoint = "upload.php";
        const formData = new FormData();

        imageInput.addEventListener("change", (e) => {
            let reader = new FileReader();

            reader.onload = (e) => {
                imageInputDiv.style.backgroundImage = `url('${reader.result}')`;
            }
            reader.readAsDataURL(imageInput.files[0]);
        });

        addPlaylistForm.appendChild(playlistNameLabel);
        addPlaylistForm.appendChild(playlistNameInput);
        addPlaylistForm.appendChild(playlistDescriptionLabel);
        addPlaylistForm.appendChild(playlistDescriptionInput);
        addPlaylistForm.appendChild(imageLabel);
        addPlaylistForm.appendChild(imageInputDiv);
        addPlaylistForm.appendChild(submitBtn);

        addPlaylistForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const file = imageInput.files[0];
            formData.append("imageInput", file);

            if (file && file['type'].split('/')[0] !== 'image') {
                alert("Fajl nije slika!");
            }

            const res = await fetch(endpoint, {
                method: "post",
                body: formData
            });

            if (res.ok) {
                let imagePath = null;

                if (file !== undefined) {
                    imagePath = `./images/${file['name']}`               
                }

                const formData = new FormData(addPlaylistForm);

                formData.append("imagePath", imagePath);
                formData.append("musicLibraryId", this.musicLibrary.id);
                formData.append("numberOfTracks", 0);
                formData.append("length", 0);

                for (var [key, value] of formData.entries()) { 
                    console.log(key, value);
                }

                const playlist = await this.musicLibrary.addPlaylist(formData);
                
                if (playlist != null) {
                    this.musicLibraryView.playlistView.playlist = playlist;
                    await this.musicLibraryView.renderPlaylistPicker();
                    await this.musicLibraryView.playlistView.removePlaylistSidebar();
                    await this.musicLibraryView.playlistView.renderPlaylistSidebar();
                }
            }
        });

        this.container.appendChild(addPlaylistForm);
    }
}