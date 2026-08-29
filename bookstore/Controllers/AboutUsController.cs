using Microsoft.AspNetCore.Mvc;

namespace bookstore.Controllers
{
    public class AboutUsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
