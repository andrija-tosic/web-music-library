using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class MusicLibraryContext : DbContext
    {
        public DbSet<MusicLibrary> MusicLibraries { get; set; }
        public DbSet<Artist> Artists { get; set; }
        public DbSet<Release> Releases { get; set; }
        public DbSet<Track> Tracks { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<PlaylistTrack> PlaylistTracks { get; set; }

        public MusicLibraryContext(DbContextOptions options) : base(options)
        {
            
        }
    }
}