using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models
{
    public class Track
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int TrackNumber { get; set; }

        public int? Duration { get; set; }

        [Range(1, 10)]
        public int? Rating { get; set; }

        [JsonIgnore]
        public Release Release { get; set; }
 
        [JsonIgnore]
        public List<PlaylistTrack> PlaylistTracks { get; set; }
    }
}