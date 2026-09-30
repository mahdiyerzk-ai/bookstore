using Microsoft.AspNetCore.Mvc;

namespace bookstore.Controllers
{
    public class CartController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
