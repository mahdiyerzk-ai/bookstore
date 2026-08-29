using Microsoft.AspNetCore.Mvc;

namespace bookstore.Controllers
{
    public class ContactUsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
