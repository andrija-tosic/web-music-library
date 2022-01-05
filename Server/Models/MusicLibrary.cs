using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models
{
    public class MusicLibrary
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Owner { get; set; }
        
        [JsonIgnore]
        public List<Playlist> Playlists { get; set; }
    }
}