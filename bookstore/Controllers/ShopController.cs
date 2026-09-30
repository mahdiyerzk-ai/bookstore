using Microsoft.AspNetCore.Mvc;

namespace bookstore.Controllers
{
    public class ShopController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
