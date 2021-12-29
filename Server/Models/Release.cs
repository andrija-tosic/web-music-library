using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models
{
    public class Release
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public DateTime? Date { get; set; }

        [MaxLength(10)]
        public string Type { get; set; }

        [MaxLength(10)]
        public string Genre { get; set; }
        public int? Duration { get; set; }

        [JsonIgnore]
        public List<Artist> Artists { get; set; }
        public List<Track> Tracklist { get; set; }
    }
}