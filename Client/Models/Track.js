export class Track {
    constructor(id, number, name, artists, release, rating, duration) {
        this.id = id;
        this.name = name;
        this.artists = artists;
        this.release = release;
        this.duration = duration;
        this.rating = rating;
        this.number = number;
    }

    async changeTrackRating(newRating) {
        const res = await fetch(`https://localhost:5001/Track/ChangeRating/${this.id}/${newRating}`, {
            method: "PATCH"
        });

        if (res.ok) {
            this.rating = newRating;
            return true;
        }
        else {
            return false;
        }
    }
}