using Microsoft.AspNetCore.Mvc;

namespace bookstore.Areas.Admin.Controllers
{
    public class ProductsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
