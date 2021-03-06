using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrackController : ControllerBase
    {
        public MusicLibraryContext Context { get; set; }

        public TrackController(MusicLibraryContext context) : base()
        {
            Context = context;
        }

        [Route("ChangeRating/{id}/{rating}")]
        [HttpPatch]
        public async Task<ActionResult> ChangeRating(int id, int rating)
        {
            try
            {
                if (id < 1)
                {
                    return BadRequest("ID out of range");
                }

                if (rating < 1 || rating > 5)
                {
                    return BadRequest("Rating out of range");
                }

                var track = await Context.Tracks.FindAsync(id);
                if (track != null)
                {
                    track.Rating = rating;

                    await Context.SaveChangesAsync();

                    return Ok($"Track rating with id {id} changed.");
                }
                else
                {
                    return NotFound("No such track found");
                }
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Route("GetTracksFromRelease/{id}")]
        [HttpGet]
        public async Task<ActionResult> GetTracksFromRelease(int id)
        {
            try
            {
                if (id < 1)
                {
                    return BadRequest("ID out of range");
                }
                
                var tracks = await Context.Tracks.Where(t => t.Release.Id == id).ToListAsync();

                if (tracks.Count == 0)
                    return NotFound("No tracks in this release");

                tracks.Sort((t1, t2) => t1.TrackNumber - t2.TrackNumber);

                return Ok(tracks);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

    }
}