using Microsoft.AspNetCore.Mvc;

namespace bookstore.Controllers
{
    public class WishlistController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
