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
                var track = await Context.Tracks.FindAsync(id);
                if (track != null)
                {
                    track.Rating = rating;

                    return Ok($"Track rating with id {id} changed.");
                }
                else {
                    return BadRequest("No such track found");
                }
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}