using Microsoft.AspNetCore.Mvc;

namespace bookstore.Controllers
{
    public class ShopController : Controller
    {
        // database 
        public IActionResult Index()
        {
            // var p = _cont.Pro.ToList();
            // viewbag.products = p;
            return View();
        }
    }
}
