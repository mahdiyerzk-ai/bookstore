using Microsoft.AspNetCore.Mvc;

namespace bookstore.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
