using bookstore.Models;
using bookstore.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace bookstore.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(LoginViewModel login)
        {
            return PartialView("_Login");
        }

        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(User user)
        {
            user.FirstName = user.FirstName.Trim();
            user.LastName = user.LastName.Trim();
            user.Email = user.Email.Trim();
            user.Password = user.Password.Trim();
            user.ConfirmPassword = user.ConfirmPassword.Trim();
            user.CreatedAt = DateTime.Now;
            //------------------
            //if (!ModelState.IsValid)
            //{
            //    return View(user);
            //}
            //------------------
            //var prevUser = _context.User.Any(z=>z.Email == user.Email);
            var prevUser = _context.Users.Any(q=>q.Email == user.Email);
            //if (prevUser)
            //{
            //    ModelState.AddModelError("Email", "Email is Used");
            //        return View(User);
            //}
            //----------------------
            _context.Users.Add(user);

            _context.SaveChanges();

            return PartialView("_Register");
        }
    }
}
