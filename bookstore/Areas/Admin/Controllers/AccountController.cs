using bookstore.Models;
using Microsoft.AspNetCore.Mvc;

namespace bookstore.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class AccountController : Controller
    {
        public readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext c)
        {
            _context = c;
        }

        public IActionResult List()
        {
            var users = _context.Users.ToList(); // linq    sql query = select * from Users

            //ViewBag.Users = users;
            ViewData["Users"] = users;
            return View();
        }
        
    }
}
