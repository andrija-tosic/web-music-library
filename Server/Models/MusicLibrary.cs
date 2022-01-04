using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class MusicLibrary
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Owner { get; set; }

        public List<Artist> Artists { get; set; }
        public List<Playlist> Playlists { get; set; }
    }
}